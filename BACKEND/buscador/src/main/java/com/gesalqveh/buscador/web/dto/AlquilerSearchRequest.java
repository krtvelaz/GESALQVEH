package com.gesalqveh.buscador.web.dto;

import com.gesalqveh.buscador.domain.EstadoAlquiler;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

public record AlquilerSearchRequest(
        Long vehiculoId,
        Long clienteId,
        String clienteDni,
        EstadoAlquiler estado,
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicioDesde,
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicioHasta,
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate finDesde,
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate finHasta
) {}
