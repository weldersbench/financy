package com.savemoney.smsgastoapp.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ReceitaData {

    private BigDecimal valor;
    private LocalDateTime dataRecebimento;
    private String descricao;
    private String categoria;
    private String notificacao;
    private String fonte;

    public ReceitaData(BigDecimal valor, LocalDateTime dataRecebimento, String descricao, String categoria, String notificacao, String fonte) {
        this.valor = valor;
        this.dataRecebimento = dataRecebimento;
        this.descricao = descricao;
        this.categoria = categoria;
        this.notificacao = notificacao;
        this.fonte = fonte;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }

    public LocalDateTime getDataHora() {
        return dataRecebimento;
    }

    public void setDataHora(LocalDateTime dataRecebimento) {
        this.dataRecebimento = dataRecebimento;
    }

    public String getEstabelecimento() {
        return descricao;
    }

    public void setEstabelecimento(String descricao) {
        this.descricao = descricao;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public String getNotificacao() {
        return notificacao;
    }

    public void setNotificacao(String notificacao) {
        this.notificacao = notificacao;
    }

    public String getNotificacaoOriginal() {
        return fonte;
    }

    public void setNotificacaoOriginal(String fonte) {
        this.fonte = fonte;
    }
}
