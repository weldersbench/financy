package com.gastos.financeiro.save_money.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "meta_financeira")
public class MetaFinanceira {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "meta_financeira_id_seq")
    @SequenceGenerator(name = "meta_financeira_id_seq", sequenceName = "meta_financeira_id_seq", allocationSize = 1)
    private Long id;
    @Column(nullable = false)
    private String nome;
    @Column(nullable = false)
    private BigDecimal valorAlvo;
    @Column(nullable = false)
    private BigDecimal valorAtual;
    @Column(nullable = false)
    private LocalDate dataAlvo;
    private LocalDate dataCriacao;
    private String status;
    private String descricao;
}
