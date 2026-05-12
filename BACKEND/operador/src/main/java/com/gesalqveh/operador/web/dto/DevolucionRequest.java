package com.gesalqveh.operador.web.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record DevolucionRequest(
        @NotNull LocalDate fechaDevolucionReal
) {}
