package com.gesalqveh.operador.web.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record ExtensionRequest(
        @NotNull @Future LocalDate nuevaFechaFin
) {}
