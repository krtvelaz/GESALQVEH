package com.gesalqveh.operador.domain;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "vehiculo")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vehiculo {

    @Id
    private Long id;

    @Column(unique = true, nullable = false, length = 20)
    private String matricula;

    @Column(nullable = false, length = 60)
    private String marca;

    @Column(nullable = false, length = 60)
    private String modelo;

    @Column(nullable = false)
    private Integer anio;

    @Column(nullable = false, length = 20)
    private String tipo;

    @Column(length = 30)
    private String color;

    @Column(name = "precio_diario", nullable = false, precision = 10, scale = 2)
    private BigDecimal precioDiario;

    @Column(nullable = false)
    private Boolean disponible;

    @Column(length = 15)
    private String transmision;

    @Column(length = 15)
    private String combustible;

    private Integer plazas;

    private Integer kilometraje;

    @Column(length = 15)
    private String categoria;

    @Column(length = 80)
    private String sucursal;

    @Column(length = 500)
    private String descripcion;

    @Column(name = "url_imagen", length = 500)
    private String urlImagen;
}
