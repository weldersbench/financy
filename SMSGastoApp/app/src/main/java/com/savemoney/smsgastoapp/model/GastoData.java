package com.savemoney.smsgastoapp.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class GastoData {

    private BigDecimal valor;
    private LocalDateTime horaData;
    private String estabelecimento;
    private String categoria;
    private String remetenteSms;
    private String smsOriginal;

    public GastoData(BigDecimal valor, LocalDateTime horaData, String estabelecimento, String categoria, String remetenteSms, String smsOriginal) {
        this.valor = valor;
        this.horaData = horaData;
        this.estabelecimento = estabelecimento;
        this.categoria = categoria;
        this.remetenteSms = remetenteSms;
        this.smsOriginal = smsOriginal;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }

    public LocalDateTime getDataHora() {
        return horaData;
    }

    public void setDataHora(LocalDateTime horaData) {
        this.horaData = horaData;
    }

    public String getEstabelecimento() {
        return estabelecimento;
    }

    public void setEstabelecimento(String estabelecimento) {
        this.estabelecimento = estabelecimento;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public String getRemetenteSms() {
        return remetenteSms;
    }

    public void setRemetenteSms(String remetenteSms) {
        this.remetenteSms = remetenteSms;
    }

    public String getSmsOriginal() {
        return smsOriginal;
    }

    public void setSmsOriginal(String smsOriginal) {
        this.smsOriginal = smsOriginal;
    }
}
