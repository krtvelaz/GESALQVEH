package com.gesalqveh.buscador.service;

import com.gesalqveh.buscador.domain.Vehiculo;
import com.gesalqveh.buscador.exception.NotFoundException;
import com.gesalqveh.buscador.repository.VehiculoRepository;
import com.gesalqveh.buscador.specification.VehiculoSpecifications;
import com.gesalqveh.buscador.web.dto.VehiculoSearchRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class VehiculoService {

    private final VehiculoRepository repository;

    public VehiculoService(VehiculoRepository repository) {
        this.repository = repository;
    }

    public List<Vehiculo> listar() {
        return repository.findAll();
    }

    public Vehiculo obtener(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Vehículo " + id + " no encontrado"));
    }

    public List<Vehiculo> buscar(VehiculoSearchRequest filter) {
        return repository.findAll(VehiculoSpecifications.withFilters(filter));
    }
}
