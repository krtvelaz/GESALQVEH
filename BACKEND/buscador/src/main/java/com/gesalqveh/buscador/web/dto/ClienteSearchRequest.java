package com.gesalqveh.buscador.web.dto;

public record ClienteSearchRequest(
        String nombre,
        String dni,
        String telefono,
        String email
) {}
