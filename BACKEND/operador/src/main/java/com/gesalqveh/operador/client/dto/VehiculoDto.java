package com.gesalqveh.operador.client.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.math.BigDecimal;

@JsonIgnoreProperties(ignoreUnknown = true)
public record VehiculoDto(
        Long id,
        String matricula,
        String marca,
        String modelo,
        BigDecimal precioDiario,
        Boolean disponible
) {}
