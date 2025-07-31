package com.savemoney.smsgastoapp;

import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.widget.Toast;


import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;


public class MainActivity extends AppCompatActivity {

    private static final int SMS_PERMISSAO_CODE = 1;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        verificarSolicitarPermissaoSms();
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
}