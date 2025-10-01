package com.savemoney.smsgastoapp.util;

import android.util.Log;

import com.savemoney.smsgastoapp.model.GastoData;
import com.savemoney.smsgastoapp.model.ReceitaData;

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
    // EX: Compra no cartão final 1001, de R$ 54,34, em 21/09/2025, ás 11:36, em AUTO POSTO, aprovada.
    private static final Pattern SANTANDER_CC_PATTERN = Pattern.compile(
            ".*R\\$ ([\\d,.]+)[^,]+,\\s*em\\s*(\\d{2}/\\d{2}/\\d{4}),\\s*á[s]?\\s*(\\d{2}:\\d{2}),\\s*em\\s*(.+?),\\s*aprovada.*"
    );

    // Padrão 3: PIX Recebido
    // Ex: "PIX recebido de FULANO DA SILVA, CPF final XXX. Valor R$ 50,00 em 20/07/2025 as 11:00h."
    // EX: "PIX enviado em 19/09/2025 as 16:09 no valor de R$ 0,14."
    // EX: "PIX recebido em 19/09/2025 as 16:09 no valor de R$ 0,14."
    private static final Pattern PIX_RECEBIDO_PATTERN = Pattern.compile(
            "PIX recebido em (\\d{2}/\\d{2}/\\d{4}) as (\\d{2}:\\d{2}) no valor de R\\$ ([\\d.,]+)"
    );

    private static final Pattern PIX_ENVIADO_PATTERN = Pattern.compile(
            "PIX enviado em (\\d{2}/\\d{2}/\\d{4}) as (\\d{2}:\\d{2}) no valor de R\\$ ([\\d.,]+)"
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

        if (gasto == null){
            Matcher pixEnviadoMatcher = PIX_ENVIADO_PATTERN.matcher(mensageBody);
            if (pixEnviadoMatcher.find()){
                gasto = extractPixEnviado(remetente, mensageBody, pixEnviadoMatcher);
            }
        }

        return gasto; // Retorna o gasto se parseado, ou null se nenhum padrão corresponder
    }

    public static ReceitaData parseNotification(String remetente, String messageBody){
        ReceitaData receita = null;

        Matcher pixRecebidoMatcher = PIX_RECEBIDO_PATTERN.matcher(messageBody);
        if (pixRecebidoMatcher.find()) {
            receita = extractPixRecebido(remetente, messageBody, pixRecebidoMatcher);
        }

        return receita;
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
            String dataStr = matcher.group(3);
            String horaStr = matcher.group(4);
            String estabelecimento = matcher.group(2).trim();

            BigDecimal valor = new BigDecimal(valorStr);
            LocalDateTime horaData = LocalDateTime.parse(dataStr + " " + horaStr, SMS_DATE_TIME_FORMATTER);

            return new GastoData(valor, horaData, estabelecimento, "Cartão de Crédito - Santander", sender, messageBody);
        } catch (Exception e) {
            Log.e(TAG, "Erro ao parsear Santander CC SMS: " + e.getMessage(), e);
            return null;
        }
    }

    private static GastoData extractPixEnviado(String sender, String messageBody, Matcher matcher) {
        try {
            String remetentePix = "";
            String dataStr = matcher.group(1);
            String horaStr = matcher.group(2);
            String valorStr = matcher.group(3).replace(",", ".");

            if (valorStr.endsWith(".")){
                valorStr = valorStr.substring(0, valorStr.length() - 1);
            }

            BigDecimal valor = new BigDecimal(valorStr);

            LocalDateTime horaData = LocalDateTime.parse(dataStr + " " + horaStr, SMS_DATE_TIME_FORMATTER);

            // Para PIX, o estabelecimento pode ser o nome do remetente
            String estabelecimento = "SANTANDER " + remetentePix;

            return new GastoData(valor, horaData, estabelecimento, "PIX ", sender, messageBody);
        } catch (Exception e) {
            Log.e(TAG, "Erro ao parsear PIX SMS: " + e.getMessage(), e);
            return null;
        }
    }

    /*Parseamento da notificação de recebimento do PIX*/
    private static ReceitaData extractPixRecebido(String notificacao, String fonteMessage, Matcher matcher){
        try {
            String dataStr = matcher.group(1);
            String hotaStr = matcher.group(2);
            String valorStr = matcher.group(3).replace(",", ".");

            if (valorStr.endsWith(".")){
                valorStr = valorStr.substring(0, valorStr.length() -1);
            }

            BigDecimal valor = new BigDecimal(valorStr);
            LocalDateTime dataHora = LocalDateTime.parse(dataStr + " " + hotaStr, SMS_DATE_TIME_FORMATTER);

            String descricao = "você acaba de receber um pix!";

            return new ReceitaData(valor, dataHora, descricao, "PIX ", notificacao, fonteMessage);
        } catch (Exception e) {
            Log.d(TAG, "Erro ao parsear PIX: " + e.getMessage(), e);
            return  null;
        }
    }
}
