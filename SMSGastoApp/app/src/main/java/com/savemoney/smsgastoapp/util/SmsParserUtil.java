package com.savemoney.smsgastoapp.util;

import android.util.Log;

import com.savemoney.smsgastoapp.model.GastoData;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class SmsParserUtil {

    private static final String TAG = "SmsParserUtil";

    // --- Padrões Regex para diferentes tipos de SMS ---

    // Padrão 1: Bradesco Cartão de Crédito
    // Ex: "BRADESCO CARTOES: COMPRA APROVADA NO CARTAO FINAL 7904 EM 14/07/2025 14:19. VALOR DE R$ 205.05 FLEXPAG*ENELSP SAO PAULO."
    private static final Pattern BRADESCO_CC_PATTERN = Pattern.compile(
            "EM (\\d{2}/\\d{2}/\\d{4}) (\\d{2}:\\d{2})\\. VALOR DE R\\$ ([\\d.,]+)(?: EM \\d+ X)? (.+)"
    );

    // Padrão 2: Santander Cartão de Crédito
    // Ex: "Santander: Compra de R$ 75,90 em MERCADO X em 20/07/2025 as 15:30h. Cartao final XXXX."
    private static final Pattern SANTANDER_CC_PATTERN = Pattern.compile(
            "Compra de R\\$ ([\\d.,]+) em (.+?) em (\\d{2}/\\d{2}/\\d{4}) as (\\d{2}:\\d{2})h"
    );

    // Padrão 3: PIX Recebido
    // Ex: "PIX recebido de FULANO DA SILVA, CPF final XXX. Valor R$ 50,00 em 20/07/2025 as 11:00h."
    private static final Pattern PIX_RECEBIDO_PATTERN = Pattern.compile(
            "PIX recebido de (.+?), CPF final \\w+\\. Valor R\\$ ([\\d.,]+) em (\\d{2}/\\d{2}/\\d{4}) as (\\d{2}:\\d{2})h"
    );

    private static final DateTimeFormatter SMS_DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    public static GastoData parseSms(String remetente, String mensageBody){
        GastoData gasto = null;

        // Tentar o padrão Bradesco CC
        Matcher bradescoCcMatcher = BRADESCO_CC_PATTERN.matcher(mensageBody);
        if (bradescoCcMatcher.find()){
            gasto = extractBradescoCc(remetente, mensageBody, bradescoCcMatcher);
        }

        // Se não for Bradesco CC, tentar Santander CC
        if (gasto == null) {
            Matcher santanderCcMatcher = SANTANDER_CC_PATTERN.matcher(mensageBody);
            if (santanderCcMatcher.find()) {
                gasto = extractSantanderCc(remetente, mensageBody, santanderCcMatcher);
            }
        }

        // Se não for Santander CC, tentar PIX
        if (gasto == null) {
            Matcher pixRecebidoMatcher = PIX_RECEBIDO_PATTERN.matcher(mensageBody);
            if (pixRecebidoMatcher.find()) {
                gasto = extractPixRecebido(remetente, mensageBody, pixRecebidoMatcher);
            }
        }
        return gasto; // Retorna o gasto se parseado, ou null se nenhum padrão corresponder
    }

    private static GastoData extractBradescoCc(String remetente, String messageBody, Matcher matcher){
        try {
            String dataStr = matcher.group(1);
            String horaStr = matcher.group(2);
            String valorStr = matcher.group(3).replace(",",".");
            String estabelecimentoRaw = matcher.group(4).trim();

            BigDecimal valor = new BigDecimal(valorStr);
            LocalDateTime horaData = LocalDateTime.parse(dataStr +" "+ horaStr, SMS_DATE_TIME_FORMATTER);

            String estabelecimento = estabelecimentoRaw;
            // Limpeza específica para Bradesco (removendo "SAO PAULO." no final)
            if (estabelecimento.endsWith(".")){
                estabelecimento = estabelecimento.substring(0, estabelecimento.length() -1);
            }
            String[] sufixoLocalidade = {"SAO PAULO", "SP", "CAMPINAS", "RJ", "RIO DE JANEIRO", "MG", "MINAS GERAIS",
                    "BH", "BELO HORIZONTE", "RS", "RIO GRANDE DO SUL", "CURITIBA", "PR", "OSASCO", "CARAPICUIBA", "SANTANA DE P", "BARUERI"};
            for (String sufixo : sufixoLocalidade) {
                String sufixoComEspaco = " " + sufixo.toUpperCase();
                if (estabelecimento.toUpperCase().endsWith(sufixoComEspaco)){
                    estabelecimento = estabelecimento.substring(0, estabelecimento.toUpperCase().lastIndexOf(sufixoComEspaco)).trim();
                    break; // Removeu, pode parar de procurar outros sufixos
                }
            }
            return new GastoData(valor, horaData, estabelecimento, "Cartão de Credito - Bradesco", remetente, messageBody);
        } catch (Exception e) {
            Log.d(TAG, "Erro ao parsear Bradesco CC SMS: " + e.getMessage());
            return null; // Tirar duvida
        }
    }

    private static GastoData extractSantanderCc(String sender, String messageBody, Matcher matcher) {
        try {
            String valorStr = matcher.group(1).replace(",", ".");
            String estabelecimento = matcher.group(2).trim();
            String dataStr = matcher.group(3);
            String horaStr = matcher.group(4);

            BigDecimal valor = new BigDecimal(valorStr);
            LocalDateTime horaData = LocalDateTime.parse(dataStr + " " + horaStr, SMS_DATE_TIME_FORMATTER);

            return new GastoData(valor, horaData, estabelecimento, "Cartão de Crédito - Santander", sender, messageBody);
        } catch (Exception e) {
            Log.e(TAG, "Erro ao parsear Santander CC SMS: " + e.getMessage(), e);
            return null;
        }
    }

    private static GastoData extractPixRecebido(String sender, String messageBody, Matcher matcher) {
        try {
            String remetentePix = matcher.group(1).trim();
            String valorStr = matcher.group(2).replace(",", ".");
            String dataStr = matcher.group(3);
            String horaStr = matcher.group(4);

            BigDecimal valor = new BigDecimal(valorStr);
            LocalDateTime horaData = LocalDateTime.parse(dataStr + " " + horaStr, SMS_DATE_TIME_FORMATTER);

            // Para PIX, o estabelecimento pode ser o nome do remetente
            String estabelecimento = "PIX de " + remetentePix;

            return new GastoData(valor, horaData, estabelecimento, "PIX - Recebido", sender, messageBody);
        } catch (Exception e) {
            Log.e(TAG, "Erro ao parsear PIX SMS: " + e.getMessage(), e);
            return null;
        }
    }
}
