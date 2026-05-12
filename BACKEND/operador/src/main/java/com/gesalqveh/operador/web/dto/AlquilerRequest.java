package com.gesalqveh.operador.web.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record AlquilerRequest(
        @NotNull Long vehiculoId,
        @NotBlank String clienteNombre,
        @NotBlank String clienteDni,
        String clienteTelefono,
        String clienteEmail,
        @NotNull LocalDate fechaInicio,
        @NotNull @Future LocalDate fechaFin
) {}
