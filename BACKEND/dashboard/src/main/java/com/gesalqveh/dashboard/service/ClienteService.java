package com.gesalqveh.dashboard.service;

import com.gesalqveh.dashboard.domain.Cliente;
import com.gesalqveh.dashboard.exception.NotFoundException;
import com.gesalqveh.dashboard.repository.ClienteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ClienteService {

    private final ClienteRepository repository;

    public ClienteService(ClienteRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<Cliente> listar() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public Cliente obtener(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Cliente " + id + " no encontrado"));
    }

    public Cliente crear(Cliente c) {
        c.setId(null);
        return repository.save(c);
    }

    public Cliente actualizar(Long id, Cliente c) {
        if (!repository.existsById(id)) {
            throw new NotFoundException("Cliente " + id + " no encontrado");
        }
        c.setId(id);
        return repository.save(c);
    }

    public void eliminar(Long id) {
        if (!repository.existsById(id)) {
            throw new NotFoundException("Cliente " + id + " no encontrado");
        }
        repository.deleteById(id);
    }
}
