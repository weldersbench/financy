package com.savemoney.smsgastoapp;

import android.Manifest;
import android.app.AlertDialog;
import android.app.ComponentCaller;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import android.text.TextUtils;
import android.widget.Button;
import android.widget.Toast;


import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.app.NotificationCompat;
import androidx.core.content.ContextCompat;


public class MainActivity extends AppCompatActivity {

    private static final int SMS_PERMISSAO_CODE = 1;
    private static final int NOTIFICATION_PERMISSAO_CODE = 2;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        verificarSolicitarPermissaoSms();
        verificarPermissaoNotificacao();

        Button postButton = findViewById(R.id.button_post_notification);
        postButton.setOnClickListener(v -> postTestNotification());
    }

    private void verificarSolicitarPermissaoSms(){
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.READ_SMS) != PackageManager.PERMISSION_GRANTED ||
        ContextCompat.checkSelfPermission(this, Manifest.permission.RECEIVE_SMS) != PackageManager.PERMISSION_GRANTED){
            ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.READ_SMS,
                    Manifest.permission.RECEIVE_SMS}, SMS_PERMISSAO_CODE);
        }else {
            Toast.makeText(this, "Permissão SMS já concedida!", Toast.LENGTH_SHORT);
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);

        if (requestCode == SMS_PERMISSAO_CODE) {
            if (grantResults.length > 0 &&
                    grantResults[0] == PackageManager.PERMISSION_GRANTED &&
                    grantResults[1] == PackageManager.PERMISSION_GRANTED) {
                // Permissões concedidas
                Toast.makeText(this, "Permissão SMS concedida!", Toast.LENGTH_LONG).show();
            } else {
                // Permissões negadas
                Toast.makeText(this, "Permissão SMS negada! O aplicativo pode não funcionar corretamente.", Toast.LENGTH_LONG).show();
            }
        }
    }

    private void verificarPermissaoNotificacao(){
        if (!isNotificationListenerEnabled()){
            new AlertDialog.Builder(this)
                    .setTitle("Acesso a Notificações Necessario")
                    .setMessage("Para funcionar, este aplicativo precisa de permissão para ler notificações. Por favor, habilite-a nas configurações.")
                    .setPositiveButton("Habilitar", (dialog, which) -> {
                        Intent intent = new Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS);
                        startActivityForResult(intent, NOTIFICATION_PERMISSAO_CODE);
                    })
                    .setNegativeButton("Cancelar", (dialog, which) -> {
                        Toast.makeText(this, "Permissão de Notificação negada.", Toast.LENGTH_SHORT).show();
                    })
                    .show();

        }else {
            Toast.makeText(this, "Acesso a Notificações já concedido!", Toast.LENGTH_SHORT).show();
        }
    }

    // Metodo auxiliar para verificar se o nosso app está habilitado como ouvinte de notificação
    private boolean isNotificationListenerEnabled(){

        String packageName = getPackageName(); // Pega o nome do pacote do proprio app.

        // O android vai armazenar os ouvintes habilitados
        final String flat = Settings.Secure.getString(getContentResolver(), "enabled_notification_listeners");

        // Verifica se a string não está vazia
        if (!TextUtils.isEmpty(flat)){
            final String[] nomes = flat.split(":"); // E separa os ouvintes por ":"

            // Percorrer a lista para encontrar o app
            for (String nome : nomes) {
                // Criamos um ComponentName a partir do nome do componente.
                final ComponentName componentName = ComponentName.unflattenFromString(nome);

                if (componentName != null && TextUtils.equals(packageName, componentName.getPackageName())){
                    return true;
                }
            }
        }
        return false;
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode == NOTIFICATION_PERMISSAO_CODE){
            if (isNotificationListenerEnabled()){
                Toast.makeText(this, "Acesso a Notificação concedida!", Toast.LENGTH_SHORT).show();
            }else {
                Toast.makeText(this, "Permissão de Notificação negada!", Toast.LENGTH_SHORT).show();
            }
        }
    }

    private void postTestNotification() {
        // Crie um canal de notificação para Android 8.0+
        String channelId = "test_channel_id";
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    channelId,
                    "Canal de Teste",
                    NotificationManager.IMPORTANCE_DEFAULT
            );
            NotificationManager notificationManager = getSystemService(NotificationManager.class);
            notificationManager.createNotificationChannel(channel);
        }

        // Crie e poste a notificação
        NotificationCompat.Builder builder = new NotificationCompat.Builder(this, channelId)
                .setSmallIcon(R.drawable.ic_launcher_foreground) // Adicione um ícone (ou use um padrão)
                .setContentTitle("Santander")
                .setContentText("PIX recebido em 19/09/2025 as 16:09 no valor de R$ 0,14.")
                .setPriority(NotificationCompat.PRIORITY_DEFAULT);

        NotificationManager notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        notificationManager.notify(1, builder.build()); // O '1' é um ID para a notificação
    }
}