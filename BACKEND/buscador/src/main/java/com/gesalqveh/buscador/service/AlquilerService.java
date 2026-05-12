package com.gesalqveh.buscador.service;

import com.gesalqveh.buscador.domain.Alquiler;
import com.gesalqveh.buscador.exception.NotFoundException;
import com.gesalqveh.buscador.repository.AlquilerRepository;
import com.gesalqveh.buscador.specification.AlquilerSpecifications;
import com.gesalqveh.buscador.web.dto.AlquilerSearchRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class AlquilerService {

    private final AlquilerRepository repository;

    public AlquilerService(AlquilerRepository repository) {
        this.repository = repository;
    }

    public List<Alquiler> listar() {
        return repository.findAll();
    }

    public Alquiler obtener(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Alquiler " + id + " no encontrado"));
    }

    public List<Alquiler> buscar(AlquilerSearchRequest filter) {
        return repository.findAll(AlquilerSpecifications.withFilters(filter));
    }
}
