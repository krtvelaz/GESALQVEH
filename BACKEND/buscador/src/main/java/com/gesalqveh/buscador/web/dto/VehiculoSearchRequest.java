package com.gesalqveh.buscador.web.dto;

import com.gesalqveh.buscador.domain.Categoria;
import com.gesalqveh.buscador.domain.Combustible;
import com.gesalqveh.buscador.domain.TipoVehiculo;
import com.gesalqveh.buscador.domain.Transmision;

import java.math.BigDecimal;

public record VehiculoSearchRequest(
        String matricula,
        String marca,
        String modelo,
        Integer anio,
        TipoVehiculo tipo,
        String color,
        BigDecimal precioMin,
        BigDecimal precioMax,
        Boolean disponible,
        Transmision transmision,
        Combustible combustible,
        Integer plazas,
        Integer kilometrajeMax,
        Categoria categoria,
        String sucursal
) {}
