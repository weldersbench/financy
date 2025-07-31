package com.gastos.financeiro.save_money.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data // Gera getters, setters, toString, equals e hashCode (Lombok)
@NoArgsConstructor // Gera construtor sem argumentos (Lombok)
@AllArgsConstructor // Gera construtor com todos os argumentos (Lombok)
@Entity // Indica que esta classe é uma entidade JPA e será mapeada para uma tabela no DB
@Table(name = "gastos") // Nome da tabela no banco de dados
public class Gasto {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "gasto_id_seq")
    @SequenceGenerator(name = "gasto_id_seq", sequenceName = "gasto_id_seq", allocationSize = 1)
    private Long id;
    @Column(nullable = false)
    private BigDecimal valor;
    @Column(nullable = false)
    private LocalDateTime dataHora;
    @Column(length = 255)
    private String descricao;
    @Column(length = 100)
    private String estabelecimento;
    private String categoria;
    private String smsOriginal;
}
