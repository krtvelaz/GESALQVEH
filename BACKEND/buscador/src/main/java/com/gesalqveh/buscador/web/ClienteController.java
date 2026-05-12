package com.gesalqveh.buscador.web;

import com.gesalqveh.buscador.domain.Cliente;
import com.gesalqveh.buscador.service.ClienteService;
import com.gesalqveh.buscador.web.dto.ClienteSearchRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/clientes")
public class ClienteController {

    private final ClienteService service;

    public ClienteController(ClienteService service) {
        this.service = service;
    }

    @GetMapping
    public List<Cliente> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public Cliente obtener(@PathVariable Long id) {
        return service.obtener(id);
    }

    @GetMapping("/por-dni/{dni}")
    public Cliente porDni(@PathVariable String dni) {
        return service.obtenerPorDni(dni);
    }

    @GetMapping("/buscar")
    public List<Cliente> buscar(@ModelAttribute ClienteSearchRequest request) {
        return service.buscar(request);
    }
}
