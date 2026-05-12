package com.gesalqveh.dashboard.web.dto;

public record ResumenDashboard(
        long alquilados,
        long proximos,
        long vencidos,
        long disponibles
) {}
