package com.gastos.financeiro.save_money.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "receitas")
public class Receita {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "receita_id_seq")
    @SequenceGenerator(name = "receita_id_seq", sequenceName = "receita_id_seq", allocationSize = 1)
    private Long id;
    @Column(nullable = false)
    private BigDecimal valor;
    @Column(nullable = false)
    private LocalDateTime dataRecebimento;
    @Column(length = 255)
    private String descricao;
    private String fonte;
    private String categoria;
    private String notificacao;

}
