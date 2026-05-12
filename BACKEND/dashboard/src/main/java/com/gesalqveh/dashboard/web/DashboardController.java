package com.gesalqveh.dashboard.web;

import com.gesalqveh.dashboard.domain.Vehiculo;
import com.gesalqveh.dashboard.repository.VehiculoRepository;
import com.gesalqveh.dashboard.service.DashboardService;
import com.gesalqveh.dashboard.service.DashboardService.TipoLista;
import com.gesalqveh.dashboard.web.dto.AlquilerView;
import com.gesalqveh.dashboard.web.dto.ResumenDashboard;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    private final DashboardService service;
    private final VehiculoRepository vehiculoRepository;

    public DashboardController(DashboardService service, VehiculoRepository vehiculoRepository) {
        this.service = service;
        this.vehiculoRepository = vehiculoRepository;
    }

    @GetMapping("/resumen")
    public ResumenDashboard resumen() {
        return service.resumen();
    }

    @GetMapping("/listas/{tipo}")
    public Object lista(@PathVariable String tipo) {
        TipoLista t = TipoLista.valueOf(tipo.toUpperCase());
        if (t == TipoLista.DISPONIBLES) {
            return vehiculoRepository.findAll().stream()
                    .filter(v -> Boolean.TRUE.equals(v.getDisponible()))
                    .toList();
        }
        return service.listar(t);
    }
}
