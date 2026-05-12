package com.gesalqveh.dashboard.repository;

import com.gesalqveh.dashboard.domain.Vehiculo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VehiculoRepository extends JpaRepository<Vehiculo, Long> {
    long countByDisponibleTrue();
}
