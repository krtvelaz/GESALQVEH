package com.gesalqveh.buscador.repository;

import com.gesalqveh.buscador.domain.Alquiler;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface AlquilerRepository extends JpaRepository<Alquiler, Long>, JpaSpecificationExecutor<Alquiler> {
}
