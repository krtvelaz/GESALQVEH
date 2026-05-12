package com.gesalqveh.buscador.domain;

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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 20)
    private String matricula;

    @Column(nullable = false, length = 60)
    private String marca;

    @Column(nullable = false, length = 60)
    private String modelo;

    @Column(nullable = false)
    private Integer anio;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TipoVehiculo tipo;

    @Column(length = 30)
    private String color;

    @Column(name = "precio_diario", nullable = false, precision = 10, scale = 2)
    private BigDecimal precioDiario;

    @Column(nullable = false)
    private Boolean disponible;

    @Enumerated(EnumType.STRING)
    @Column(length = 15)
    private Transmision transmision;

    @Enumerated(EnumType.STRING)
    @Column(length = 15)
    private Combustible combustible;

    private Integer plazas;

    private Integer kilometraje;

    @Enumerated(EnumType.STRING)
    @Column(length = 15)
    private Categoria categoria;

    @Column(length = 80)
    private String sucursal;

    @Column(length = 500)
    private String descripcion;

    @Column(name = "url_imagen", length = 500)
    private String urlImagen;
}
