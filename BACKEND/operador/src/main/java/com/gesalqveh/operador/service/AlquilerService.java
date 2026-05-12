package com.gesalqveh.operador.service;

import com.gesalqveh.operador.client.BuscadorClient;
import com.gesalqveh.operador.client.dto.VehiculoDto;
import com.gesalqveh.operador.domain.Alquiler;
import com.gesalqveh.operador.domain.Cliente;
import com.gesalqveh.operador.domain.EstadoAlquiler;
import com.gesalqveh.operador.domain.Vehiculo;
import com.gesalqveh.operador.exception.BusinessException;
import com.gesalqveh.operador.exception.NotFoundException;
import com.gesalqveh.operador.repository.AlquilerRepository;
import com.gesalqveh.operador.repository.ClienteRepository;
import com.gesalqveh.operador.repository.VehiculoRepository;
import com.gesalqveh.operador.web.dto.AlquilerRequest;
import com.gesalqveh.operador.web.dto.DevolucionRequest;
import com.gesalqveh.operador.web.dto.ExtensionRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Service
public class AlquilerService {

    private static final BigDecimal RECARGO_MULTIPLIER = new BigDecimal("1.5");

    private final AlquilerRepository alquilerRepository;
    private final VehiculoRepository vehiculoRepository;
    private final ClienteRepository clienteRepository;
    private final BuscadorClient buscadorClient;

    public AlquilerService(AlquilerRepository alquilerRepository,
                           VehiculoRepository vehiculoRepository,
                           ClienteRepository clienteRepository,
                           BuscadorClient buscadorClient) {
        this.alquilerRepository = alquilerRepository;
        this.vehiculoRepository = vehiculoRepository;
        this.clienteRepository = clienteRepository;
        this.buscadorClient = buscadorClient;
    }

    @Transactional
    public Alquiler alquilar(AlquilerRequest req) {
        if (!req.fechaFin().isAfter(req.fechaInicio())) {
            throw new BusinessException("La fecha fin debe ser posterior a la fecha inicio");
        }

        VehiculoDto vehDto = buscadorClient.findVehiculo(req.vehiculoId())
                .orElseThrow(() -> new NotFoundException("Vehículo " + req.vehiculoId() + " no encontrado"));
        if (Boolean.FALSE.equals(vehDto.disponible())) {
            throw new BusinessException("El vehículo no está disponible");
        }

        Vehiculo vehiculo = vehiculoRepository.findById(vehDto.id())
                .orElseThrow(() -> new NotFoundException("Vehículo (BD) " + vehDto.id() + " no encontrado"));

        Cliente cliente = clienteRepository.findByDni(req.clienteDni())
                .map(existing -> {
                    existing.setNombre(req.clienteNombre());
                    if (req.clienteTelefono() != null) existing.setTelefono(req.clienteTelefono());
                    if (req.clienteEmail() != null) existing.setEmail(req.clienteEmail());
                    return clienteRepository.save(existing);
                })
                .orElseGet(() -> clienteRepository.save(Cliente.builder()
                        .nombre(req.clienteNombre())
                        .dni(req.clienteDni())
                        .telefono(req.clienteTelefono())
                        .email(req.clienteEmail())
                        .build()));

        long dias = ChronoUnit.DAYS.between(req.fechaInicio(), req.fechaFin());
        BigDecimal costoTotal = vehiculo.getPrecioDiario().multiply(BigDecimal.valueOf(dias));

        vehiculo.setDisponible(false);
        vehiculoRepository.save(vehiculo);

        Alquiler alquiler = Alquiler.builder()
                .vehiculo(vehiculo)
                .cliente(cliente)
                .fechaInicio(req.fechaInicio())
                .fechaFin(req.fechaFin())
                .costoTotal(costoTotal)
                .recargo(BigDecimal.ZERO)
                .estado(EstadoAlquiler.ACTIVO)
                .build();
        return alquilerRepository.save(alquiler);
    }

    @Transactional
    public Alquiler devolver(Long alquilerId, DevolucionRequest req) {
        Alquiler alquiler = alquilerRepository.findById(alquilerId)
                .orElseThrow(() -> new NotFoundException("Alquiler " + alquilerId + " no encontrado"));
        if (alquiler.getEstado() == EstadoAlquiler.FINALIZADO) {
            throw new BusinessException("El alquiler ya está finalizado");
        }

        LocalDate devolucion = req.fechaDevolucionReal();
        alquiler.setFechaDevolucionReal(devolucion);

        BigDecimal recargo = BigDecimal.ZERO;
        if (devolucion.isAfter(alquiler.getFechaFin())) {
            long diasVencidos = ChronoUnit.DAYS.between(alquiler.getFechaFin(), devolucion);
            recargo = alquiler.getVehiculo().getPrecioDiario()
                    .multiply(BigDecimal.valueOf(diasVencidos))
                    .multiply(RECARGO_MULTIPLIER);
        }
        alquiler.setRecargo(recargo);
        alquiler.setEstado(EstadoAlquiler.FINALIZADO);

        Vehiculo veh = alquiler.getVehiculo();
        veh.setDisponible(true);
        vehiculoRepository.save(veh);

        return alquilerRepository.save(alquiler);
    }

    @Transactional
    public Alquiler extender(Long alquilerId, ExtensionRequest req) {
        Alquiler alquiler = alquilerRepository.findById(alquilerId)
                .orElseThrow(() -> new NotFoundException("Alquiler " + alquilerId + " no encontrado"));
        if (alquiler.getEstado() != EstadoAlquiler.ACTIVO) {
            throw new BusinessException("Solo se pueden extender alquileres activos");
        }
        if (alquiler.getFechaFin().isBefore(LocalDate.now())) {
            throw new BusinessException("No se puede extender un alquiler vencido");
        }
        if (!req.nuevaFechaFin().isAfter(alquiler.getFechaFin())) {
            throw new BusinessException("La nueva fecha debe ser posterior a la actual fecha fin");
        }

        long diasAdicionales = ChronoUnit.DAYS.between(alquiler.getFechaFin(), req.nuevaFechaFin());
        BigDecimal extra = alquiler.getVehiculo().getPrecioDiario().multiply(BigDecimal.valueOf(diasAdicionales));
        alquiler.setCostoTotal(alquiler.getCostoTotal().add(extra));
        alquiler.setFechaFin(req.nuevaFechaFin());
        return alquilerRepository.save(alquiler);
    }
}
