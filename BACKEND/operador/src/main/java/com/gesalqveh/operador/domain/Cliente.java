package com.gesalqveh.operador.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cliente")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String nombre;

    @Column(unique = true, nullable = false, length = 20)
    private String dni;

    @Column(length = 30)
    private String telefono;

    @Column(length = 120)
    private String email;
}
