package com.gesalqveh.operador.web;

import com.gesalqveh.operador.domain.Alquiler;
import com.gesalqveh.operador.service.AlquilerService;
import com.gesalqveh.operador.web.dto.AlquilerRequest;
import com.gesalqveh.operador.web.dto.DevolucionRequest;
import com.gesalqveh.operador.web.dto.ExtensionRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/alquileres")
public class AlquilerController {

    private final AlquilerService service;

    public AlquilerController(AlquilerService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Alquiler> alquilar(@Valid @RequestBody AlquilerRequest req) {
        Alquiler creado = service.alquilar(req);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }

    @PostMapping("/{id}/devolver")
    public Alquiler devolver(@PathVariable Long id, @Valid @RequestBody DevolucionRequest req) {
        return service.devolver(id, req);
    }

    @PutMapping("/{id}/extender")
    public Alquiler extender(@PathVariable Long id, @Valid @RequestBody ExtensionRequest req) {
        return service.extender(id, req);
    }
}
