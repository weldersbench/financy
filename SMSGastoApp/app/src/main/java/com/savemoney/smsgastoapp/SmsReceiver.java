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

public class SmsReceiver extends BroadcastReceiver {

    private static final String TAG = "SmsReceiver"; // Para logs
    private static final String BACKEND_URL = "http://10.0.2.2:8080/api/gastos";
    private final OkHttpClient httpClient = new OkHttpClient();
    private final Gson gson = new GsonBuilder()
            .registerTypeAdapter(LocalDateTime.class, new LocalDateTimeConverter()).create();

    @Override
    public void onReceive(Context context, Intent intent) {
        if ("android.provider.Telephony.SMS_RECEIVED".equals(intent.getAction())) {
            Bundle bundle = intent.getExtras();
            if (bundle != null) {
                // PDU (Protocol Data Unit) é o formato padrão para SMS
                Object[] pdus = (Object[]) bundle.get("pdus");
                if (pdus != null) {
                    StringBuilder fullSms = new StringBuilder();
                    String remetente = "";

                    //O loop itera sobre os PDUs (partes do SMS, se for longo)
                    // Cada 'pdu' no array 'pdus' é um byte[]
                    for (int i = 0; i < pdus.length; i++) {
                        // Correto: cria um SmsMessage a partir do byte[]
                        SmsMessage smsMessage = SmsMessage.createFromPdu((byte[]) pdus[i]);
                        fullSms.append(smsMessage.getMessageBody());

                        // Para o remetente, basta pegar do primeiro SmsMessage
                        if (i == 0) {
                            remetente = smsMessage.getDisplayOriginatingAddress();
                        }
                    }

                    String messageBody = fullSms.toString();

                    Log.d(TAG, "SMS Recebido de: " + remetente);
                    Log.d(TAG, "Corpo da Mensagem: " + messageBody);

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
                        sendGastoToBackend(gasto);

                    } else {
                        Log.d(TAG, "SMS não corresponde a nenhum padrão conhecido ou erro no parsing: " + messageBody);
                        // Você pode adicionar lógica aqui para notificar o usuário para categorizar manualmente
                    }

                }
            }
        }
    }

    private void sendGastoToBackend(GastoData gasto){
        String json = gson.toJson(gasto);
        Log.d(TAG, "Enviando JSON para o backend" + json);

        RequestBody body = RequestBody.create(json, MediaType.parse("application/json; charset=utf-8"));

        Request request = new Request.Builder().url(BACKEND_URL)
                .post(body)
                .build();

        httpClient.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(@NonNull Call call, @NonNull IOException e) {
                Log.d(TAG, "Erro ao enviar gasto pata o backend: " + e.getMessage(), e);
            }

            @Override
            public void onResponse(@NonNull Call call, @NonNull Response response) throws IOException {
                if (response.isSuccessful()){
                    String responseBody = response.body().string();
                    Log.d(TAG, "Gasto enviado com sucesso! Resposta do Backend: " + responseBody);
                }else {
                    Log.d(TAG, "Falha ao enviar gasto para o backend. Código: " + response.code() +
                            ", Mensagem: " + response.message() + ", Corpo: " + response.body().string());
                }
                response.close();
            }
        });

    }
}
