package com.gesalqveh.dashboard.web.dto;

import com.gesalqveh.dashboard.domain.Alquiler;
import com.gesalqveh.dashboard.domain.EstadoAlquiler;

import java.math.BigDecimal;
import java.time.LocalDate;

public record AlquilerView(
        Long id,
        Long vehiculoId,
        String vehiculoMatricula,
        String vehiculoDescripcion,
        Long clienteId,
        String clienteNombre,
        String clienteDni,
        LocalDate fechaInicio,
        LocalDate fechaFin,
        LocalDate fechaDevolucionReal,
        BigDecimal costoTotal,
        BigDecimal recargo,
        EstadoAlquiler estado,
        Long diasVencidos
) {
    public static AlquilerView from(Alquiler a, Long diasVencidos, BigDecimal recargoCalculado) {
        return new AlquilerView(
                a.getId(),
                a.getVehiculo().getId(),
                a.getVehiculo().getMatricula(),
                a.getVehiculo().getMarca() + " " + a.getVehiculo().getModelo(),
                a.getCliente().getId(),
                a.getCliente().getNombre(),
                a.getCliente().getDni(),
                a.getFechaInicio(),
                a.getFechaFin(),
                a.getFechaDevolucionReal(),
                a.getCostoTotal(),
                recargoCalculado,
                a.getEstado(),
                diasVencidos
        );
    }
}
