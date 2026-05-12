package com.gesalqveh.dashboard.service;

import com.gesalqveh.dashboard.domain.Alquiler;
import com.gesalqveh.dashboard.domain.EstadoAlquiler;
import com.gesalqveh.dashboard.repository.AlquilerRepository;
import com.gesalqveh.dashboard.repository.VehiculoRepository;
import com.gesalqveh.dashboard.web.dto.AlquilerView;
import com.gesalqveh.dashboard.web.dto.ResumenDashboard;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class DashboardService {

    static final BigDecimal RECARGO_MULTIPLIER = new BigDecimal("1.5");
    private static final int DIAS_PROXIMO = 3;

    private final AlquilerRepository alquilerRepository;
    private final VehiculoRepository vehiculoRepository;

    public DashboardService(AlquilerRepository alquilerRepository, VehiculoRepository vehiculoRepository) {
        this.alquilerRepository = alquilerRepository;
        this.vehiculoRepository = vehiculoRepository;
    }

    public ResumenDashboard resumen() {
        LocalDate hoy = LocalDate.now();
        LocalDate limite = hoy.plusDays(DIAS_PROXIMO);
        long alquilados = alquilerRepository.countByEstado(EstadoAlquiler.ACTIVO);
        long proximos = alquilerRepository.countByEstadoAndFechaFinBetween(EstadoAlquiler.ACTIVO, hoy, limite);
        long vencidos = alquilerRepository.countByEstadoAndFechaFinBefore(EstadoAlquiler.ACTIVO, hoy);
        long disponibles = vehiculoRepository.countByDisponibleTrue();
        return new ResumenDashboard(alquilados, proximos, vencidos, disponibles);
    }

    public List<AlquilerView> listar(TipoLista tipo) {
        LocalDate hoy = LocalDate.now();
        List<Alquiler> resultado = switch (tipo) {
            case ALQUILADOS -> alquilerRepository.findByEstado(EstadoAlquiler.ACTIVO);
            case PROXIMOS -> alquilerRepository.findByEstadoAndFechaFinBetween(
                    EstadoAlquiler.ACTIVO, hoy, hoy.plusDays(DIAS_PROXIMO));
            case VENCIDOS -> alquilerRepository.findByEstadoAndFechaFinBefore(EstadoAlquiler.ACTIVO, hoy);
            case DISPONIBLES -> List.of();
        };
        return resultado.stream().map(a -> toView(a, hoy)).toList();
    }

    private AlquilerView toView(Alquiler a, LocalDate hoy) {
        long diasVencidos = 0;
        BigDecimal recargo = a.getRecargo() != null ? a.getRecargo() : BigDecimal.ZERO;
        if (a.getEstado() == EstadoAlquiler.ACTIVO && a.getFechaFin().isBefore(hoy)) {
            diasVencidos = ChronoUnit.DAYS.between(a.getFechaFin(), hoy);
            recargo = a.getVehiculo().getPrecioDiario()
                    .multiply(BigDecimal.valueOf(diasVencidos))
                    .multiply(RECARGO_MULTIPLIER);
        }
        return AlquilerView.from(a, diasVencidos, recargo);
    }

    public enum TipoLista { ALQUILADOS, PROXIMOS, VENCIDOS, DISPONIBLES }
}
