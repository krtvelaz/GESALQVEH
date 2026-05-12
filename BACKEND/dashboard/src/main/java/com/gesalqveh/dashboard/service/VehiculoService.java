package com.gesalqveh.dashboard.service;

import com.gesalqveh.dashboard.domain.Vehiculo;
import com.gesalqveh.dashboard.exception.NotFoundException;
import com.gesalqveh.dashboard.repository.VehiculoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class VehiculoService {

    private final VehiculoRepository repository;

    public VehiculoService(VehiculoRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<Vehiculo> listar() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public Vehiculo obtener(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Vehículo " + id + " no encontrado"));
    }

    public Vehiculo crear(Vehiculo v) {
        v.setId(null);
        if (v.getDisponible() == null) v.setDisponible(true);
        return repository.save(v);
    }

    public Vehiculo actualizar(Long id, Vehiculo v) {
        if (!repository.existsById(id)) {
            throw new NotFoundException("Vehículo " + id + " no encontrado");
        }
        v.setId(id);
        return repository.save(v);
    }

    public void eliminar(Long id) {
        if (!repository.existsById(id)) {
            throw new NotFoundException("Vehículo " + id + " no encontrado");
        }
        repository.deleteById(id);
    }
}
