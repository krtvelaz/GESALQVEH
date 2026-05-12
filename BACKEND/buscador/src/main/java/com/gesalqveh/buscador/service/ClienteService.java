package com.gesalqveh.buscador.service;

import com.gesalqveh.buscador.domain.Cliente;
import com.gesalqveh.buscador.exception.NotFoundException;
import com.gesalqveh.buscador.repository.ClienteRepository;
import com.gesalqveh.buscador.specification.ClienteSpecifications;
import com.gesalqveh.buscador.web.dto.ClienteSearchRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class ClienteService {

    private final ClienteRepository repository;

    public ClienteService(ClienteRepository repository) {
        this.repository = repository;
    }

    public List<Cliente> listar() {
        return repository.findAll();
    }

    public Cliente obtener(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Cliente " + id + " no encontrado"));
    }

    public Cliente obtenerPorDni(String dni) {
        return repository.findByDni(dni)
                .orElseThrow(() -> new NotFoundException("Cliente con DNI " + dni + " no encontrado"));
    }

    public List<Cliente> buscar(ClienteSearchRequest filter) {
        return repository.findAll(ClienteSpecifications.withFilters(filter));
    }
}
