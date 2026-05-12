package com.gesalqveh.buscador.specification;

import com.gesalqveh.buscador.domain.Cliente;
import com.gesalqveh.buscador.web.dto.ClienteSearchRequest;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public final class ClienteSpecifications {

    private ClienteSpecifications() {}

    public static Specification<Cliente> withFilters(ClienteSearchRequest f) {
        return (root, query, cb) -> {
            List<Predicate> ps = new ArrayList<>();
            if (f.nombre() != null) ps.add(cb.like(cb.lower(root.get("nombre")), like(f.nombre())));
            if (f.dni() != null) ps.add(cb.like(cb.lower(root.get("dni")), like(f.dni())));
            if (f.telefono() != null) ps.add(cb.like(cb.lower(root.get("telefono")), like(f.telefono())));
            if (f.email() != null) ps.add(cb.like(cb.lower(root.get("email")), like(f.email())));
            return cb.and(ps.toArray(new Predicate[0]));
        };
    }

    private static String like(String v) {
        return "%" + v.toLowerCase() + "%";
    }
}
