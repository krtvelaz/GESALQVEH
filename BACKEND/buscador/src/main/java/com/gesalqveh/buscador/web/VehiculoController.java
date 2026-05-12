package com.gesalqveh.buscador.web;

import com.gesalqveh.buscador.domain.Vehiculo;
import com.gesalqveh.buscador.service.VehiculoService;
import com.gesalqveh.buscador.web.dto.VehiculoSearchRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vehiculos")
public class VehiculoController {

    private final VehiculoService service;

    public VehiculoController(VehiculoService service) {
        this.service = service;
    }

    @GetMapping
    public List<Vehiculo> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public Vehiculo obtener(@PathVariable Long id) {
        return service.obtener(id);
    }

    @GetMapping("/buscar")
    public List<Vehiculo> buscar(@ModelAttribute VehiculoSearchRequest request) {
        return service.buscar(request);
    }
}
