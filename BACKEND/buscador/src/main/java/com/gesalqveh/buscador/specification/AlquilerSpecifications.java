package com.gesalqveh.buscador.specification;

import com.gesalqveh.buscador.domain.Alquiler;
import com.gesalqveh.buscador.web.dto.AlquilerSearchRequest;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public final class AlquilerSpecifications {

    private AlquilerSpecifications() {}

    public static Specification<Alquiler> withFilters(AlquilerSearchRequest f) {
        return (root, query, cb) -> {
            List<Predicate> ps = new ArrayList<>();
            if (f.vehiculoId() != null) ps.add(cb.equal(root.get("vehiculo").get("id"), f.vehiculoId()));
            if (f.clienteId() != null) ps.add(cb.equal(root.get("cliente").get("id"), f.clienteId()));
            if (f.clienteDni() != null) ps.add(cb.equal(root.get("cliente").get("dni"), f.clienteDni()));
            if (f.estado() != null) ps.add(cb.equal(root.get("estado"), f.estado()));
            if (f.inicioDesde() != null) ps.add(cb.greaterThanOrEqualTo(root.get("fechaInicio"), f.inicioDesde()));
            if (f.inicioHasta() != null) ps.add(cb.lessThanOrEqualTo(root.get("fechaInicio"), f.inicioHasta()));
            if (f.finDesde() != null) ps.add(cb.greaterThanOrEqualTo(root.get("fechaFin"), f.finDesde()));
            if (f.finHasta() != null) ps.add(cb.lessThanOrEqualTo(root.get("fechaFin"), f.finHasta()));
            return cb.and(ps.toArray(new Predicate[0]));
        };
    }
}
