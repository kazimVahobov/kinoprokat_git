package com.example.kinoprokat.common_activities;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.TextView;

import com.example.kinoprokat.R;

public class LoginPage extends AppCompatActivity {

    private Button sign_in;
    private EditText login, password;
    private ProgressBar progress_bar;
    private TextView error_view;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login_page);

        findItems();
    }

    private void findItems() {
        sign_in = (Button) findViewById(R.id.sign_in_btn);
        login = (EditText) findViewById(R.id.login_txt);
        password = (EditText) findViewById(R.id.password_txt);
        progress_bar = (ProgressBar) findViewById(R.id.progress_bar);
        error_view = (TextView) findViewById(R.id.login_error);
    }
}
