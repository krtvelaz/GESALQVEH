package com.gesalqveh.buscador.specification;

import com.gesalqveh.buscador.domain.Vehiculo;
import com.gesalqveh.buscador.web.dto.VehiculoSearchRequest;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public final class VehiculoSpecifications {

    private VehiculoSpecifications() {}

    public static Specification<Vehiculo> withFilters(VehiculoSearchRequest f) {
        return (root, query, cb) -> {
            List<Predicate> ps = new ArrayList<>();
            if (f.matricula() != null) ps.add(cb.like(cb.lower(root.get("matricula")), like(f.matricula())));
            if (f.marca() != null) ps.add(cb.like(cb.lower(root.get("marca")), like(f.marca())));
            if (f.modelo() != null) ps.add(cb.like(cb.lower(root.get("modelo")), like(f.modelo())));
            if (f.anio() != null) ps.add(cb.equal(root.get("anio"), f.anio()));
            if (f.tipo() != null) ps.add(cb.equal(root.get("tipo"), f.tipo()));
            if (f.color() != null) ps.add(cb.like(cb.lower(root.get("color")), like(f.color())));
            if (f.precioMin() != null) ps.add(cb.greaterThanOrEqualTo(root.get("precioDiario"), f.precioMin()));
            if (f.precioMax() != null) ps.add(cb.lessThanOrEqualTo(root.get("precioDiario"), f.precioMax()));
            if (f.disponible() != null) ps.add(cb.equal(root.get("disponible"), f.disponible()));
            if (f.transmision() != null) ps.add(cb.equal(root.get("transmision"), f.transmision()));
            if (f.combustible() != null) ps.add(cb.equal(root.get("combustible"), f.combustible()));
            if (f.plazas() != null) ps.add(cb.equal(root.get("plazas"), f.plazas()));
            if (f.kilometrajeMax() != null) ps.add(cb.lessThanOrEqualTo(root.get("kilometraje"), f.kilometrajeMax()));
            if (f.categoria() != null) ps.add(cb.equal(root.get("categoria"), f.categoria()));
            if (f.sucursal() != null) ps.add(cb.like(cb.lower(root.get("sucursal")), like(f.sucursal())));
            return cb.and(ps.toArray(new Predicate[0]));
        };
    }

    private static String like(String value) {
        return "%" + value.toLowerCase() + "%";
    }
}
