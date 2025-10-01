package com.savemoney.smsgastoapp.service;

import android.service.notification.NotificationListenerService;
import android.service.notification.StatusBarNotification;
import android.util.Log;

import com.savemoney.smsgastoapp.model.GastoData;
import com.savemoney.smsgastoapp.model.ReceitaData;
import com.savemoney.smsgastoapp.util.SmsParserUtil;

public class MyNotificationListener extends NotificationListenerService {

    private static final String TAG = "MyNotificationListener";

    @Override
    public void onNotificationPosted(StatusBarNotification sbn) {
        super.onNotificationPosted(sbn);

        String packageName = sbn.getPackageName(); // Nome da aplicação que enviou a notificação
        String title = sbn.getNotification().extras.getString("android.title"); // Titulo principal da notificação (ex: Conta, Corrente ou Santander)
        String text = sbn.getNotification().extras.getString("android.text"); // Conteudo da notificação
        String bigText = sbn.getNotification().extras.getString("android.bigText"); // Conteudo da notificação

        Log.d(TAG, "Notificação de: " + packageName);
        Log.d(TAG, "Titulo: " + title);
        Log.d(TAG, "Texto: " + text);
        Log.d(TAG, "bigTexto: " + bigText);

        if (packageName != null && packageName.contains("savemoney")){
            Log.d(TAG, "Notificação Detectada!");

            String mensagemParse = bigText != null ? bigText : text; // Seleciona a melhor fonte disponivel, com base no tamanho do texto

            Log.d(TAG, "Valor da mensagem: " + mensagemParse);

            if (mensagemParse != null && mensagemParse.contains("recebido")){
                ReceitaData receita = SmsParserUtil.parseNotification(title, mensagemParse);
                if (receita != null){
                    HttpService.sendReceitaBackend(receita);
                }
            }else {
                GastoData gasto = SmsParserUtil.parseSms(title, mensagemParse);
                if (gasto != null){
                    Log.d(TAG, "Notificação do Santander parseada com sucesso!");
                    HttpService.sendGastoToBackend(gasto);
                }
            }
        }
    }
}
