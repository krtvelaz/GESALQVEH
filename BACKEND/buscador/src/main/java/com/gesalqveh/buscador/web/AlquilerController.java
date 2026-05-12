package com.gesalqveh.buscador.web;

import com.gesalqveh.buscador.domain.Alquiler;
import com.gesalqveh.buscador.service.AlquilerService;
import com.gesalqveh.buscador.web.dto.AlquilerSearchRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/alquileres")
public class AlquilerController {

    private final AlquilerService service;

    public AlquilerController(AlquilerService service) {
        this.service = service;
    }

    @GetMapping
    public List<Alquiler> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public Alquiler obtener(@PathVariable Long id) {
        return service.obtener(id);
    }

    @GetMapping("/buscar")
    public List<Alquiler> buscar(@ModelAttribute AlquilerSearchRequest request) {
        return service.buscar(request);
    }
}
