package com.gesalqveh.dashboard.repository;

import com.gesalqveh.dashboard.domain.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
}
