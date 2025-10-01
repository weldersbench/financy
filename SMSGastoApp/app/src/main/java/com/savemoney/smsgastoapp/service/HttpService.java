package com.savemoney.smsgastoapp.service;

import android.nfc.Tag;
import android.util.Log;

import androidx.annotation.NonNull;

import com.fatboyindustrial.gsonjavatime.LocalDateTimeConverter;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.savemoney.smsgastoapp.model.GastoData;
import com.savemoney.smsgastoapp.model.ReceitaData;

import java.io.IOException;
import java.time.LocalDateTime;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class HttpService {

    private static final String TAG = "HttpService";
    private static final String BACKEND_GASTOS = "http://10.0.2.2:8080/api/gastos";
    private static final String BACKEND_RECEITAS = "http://10.0.2.2:8080/api/receitas";
    private static final OkHttpClient httpClient = new OkHttpClient();

    private static final Gson gson = new GsonBuilder()
            .registerTypeAdapter(LocalDateTime.class, new LocalDateTimeConverter()).create();

    public static void sendGastoToBackend(GastoData gasto){
        String json = gson.toJson(gasto);
        Log.d(TAG, "Enviando JSON para o backend" + json);

        RequestBody body = RequestBody.create(json, MediaType.parse("application/json; charset=utf-8"));

        Request request = new Request.Builder().url(BACKEND_GASTOS)
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

    public static void sendReceitaBackend(ReceitaData receita){
        String json = gson.toJson(receita);
        Log.d(TAG, "Enviando JSON para o backend" + json);

        RequestBody body = RequestBody.create(json, MediaType.parse("application/json; charset=utf-8"));
        Request request = new Request.Builder().url(BACKEND_RECEITAS)
                .post(body)
                .build();

        httpClient.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(@NonNull Call call, @NonNull IOException e) {
                Log.d(TAG, "Erro ao enviar a receita para o backend: " + e.getMessage(), e);
            }

            @Override
            public void onResponse(@NonNull Call call, @NonNull Response response) throws IOException {
                if (response.isSuccessful()){
                    String responseBody = response.body().string();
                    Log.d(TAG, "Receita enviado com sucesso para o backend: " + responseBody);
                }else {
                    Log.d(TAG, "Falha ao enviar a receita para o backend. CODIGO: "
                            + response.code() + "Mensagem: " + response.message() + " , Corpo: " + response.body().string());
                }
                response.close();
            }
        });
    }
}
