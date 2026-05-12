package com.gesalqveh.dashboard.repository;

import com.gesalqveh.dashboard.domain.Alquiler;
import com.gesalqveh.dashboard.domain.EstadoAlquiler;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface AlquilerRepository extends JpaRepository<Alquiler, Long> {
    List<Alquiler> findByEstado(EstadoAlquiler estado);
    List<Alquiler> findByEstadoAndFechaFinBetween(EstadoAlquiler estado, LocalDate from, LocalDate to);
    List<Alquiler> findByEstadoAndFechaFinBefore(EstadoAlquiler estado, LocalDate date);
    long countByEstado(EstadoAlquiler estado);
    long countByEstadoAndFechaFinBetween(EstadoAlquiler estado, LocalDate from, LocalDate to);
    long countByEstadoAndFechaFinBefore(EstadoAlquiler estado, LocalDate date);
}
