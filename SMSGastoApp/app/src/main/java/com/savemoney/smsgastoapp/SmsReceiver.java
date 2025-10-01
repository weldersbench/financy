package com.savemoney.smsgastoapp;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.telephony.SmsMessage;
import android.util.Log;

import androidx.annotation.NonNull;

import com.fatboyindustrial.gsonjavatime.LocalDateTimeConverter;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.savemoney.smsgastoapp.model.GastoData;
import com.savemoney.smsgastoapp.service.HttpService;
import com.savemoney.smsgastoapp.util.SmsParserUtil;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
/*
Ouvinte de SMS
*/
public class SmsReceiver extends BroadcastReceiver {

    private static final String TAG = "SmsReceiver"; // Para logs

    // Recebe os dados do SMS
    @Override
    public void onReceive(Context context, Intent intent) {
        // Intent identifica a chegada do SMS
        if ("android.provider.Telephony.SMS_RECEIVED".equals(intent.getAction())) {
            /*O Intent (o sinal de evento) traz consigo um objeto Bundle.
              Pense no Bundle como uma "caixa" que o sistema Android usa para guardar todos os dados anexados
              a um evento (a mensagem, a porta, o formato, etc.).*/
            Bundle bundle = intent.getExtras();
            if (bundle != null) {
                /*Os dados reais do SMS são armazenados no Bundle sob a chave "pdus".
                  Um PDU (Protocol Data Unit) é o formato de dados brutos que a rede de telefonia usa.
                  É um array porque um SMS longo pode ser fragmentado em várias partes, e cada parte é um PDU.*/
                Object[] pdus = (Object[]) bundle.get("pdus");
                if (pdus != null) {
                    StringBuilder fullSms = new StringBuilder();
                    String remetente = "";

                    /*O loop percorre cada parte do SMS no array pdus, garantindo que uma mensagem fragmentada seja totalmente capturada.*/
                    for (int i = 0; i < pdus.length; i++) {

                        /*Esta é a linha mais importante.
                          Ela pega o array de bytes bruto (byte[]) do PDU e usa o metodo estático createFromPdu() para decodificá-lo no objeto legível SmsMessage.
                          O SmsMessage é a classe que o Android usa para representar o SMS.*/
                        SmsMessage smsMessage = SmsMessage.createFromPdu((byte[]) pdus[i]);

                        /*O messageBody decodificado (o texto que você lê) é anexado à StringBuilder (fullSms), reconstruindo o texto completo da mensagem.*/
                        fullSms.append(smsMessage.getMessageBody());

                        /*O remetente do SMS é sempre o mesmo para todas as partes da mensagem.
                        Por eficiência, o código só precisa capturar o número do remetente (o displayOriginatingAddress) uma única vez,
                        na primeira iteração (i = 0).*/
                        if (i == 0) {
                            remetente = smsMessage.getDisplayOriginatingAddress();
                        }
                    }

                    String messageBody = fullSms.toString(); // messagem completa

                    Log.d(TAG, "SMS Recebido de: " + remetente);
                    Log.d(TAG, "Corpo da Mensagem: " + messageBody);

                    // Envia para o SmsParserUtil para validar qual o padrão de mensagem foi recebida
                    GastoData gasto = SmsParserUtil.parseSms(remetente, messageBody);

                    if (gasto != null) {
                        Log.d(TAG, "Gasto Parseado com Sucesso:");
                        Log.d(TAG, "  Valor: " + gasto.getValor());
                        Log.d(TAG, "  Data/Hora: " + gasto.getDataHora());
                        Log.d(TAG, "  Estabelecimento: " + gasto.getEstabelecimento());
                        Log.d(TAG, "  Categoria: " + gasto.getCategoria());
                        Log.d(TAG, "  Remetente SMS: " + gasto.getRemetenteSms());
                        Log.d(TAG, "  SMS Original: " + gasto.getSmsOriginal());

                        // Chamar o metodo para enviar para o backend

                        HttpService.sendGastoToBackend(gasto);

                    } else {
                        Log.d(TAG, "SMS não corresponde a nenhum padrão conhecido ou erro no parsing: " + messageBody);
                        // Você pode adicionar lógica aqui para notificar o usuário para categorizar manualmente
                    }

                }
            }
        }
    }

}
