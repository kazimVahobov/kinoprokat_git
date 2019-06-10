package com.example.kinoprokat.modules.theater.activities;

import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentTransaction;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;

import com.example.kinoprokat.R;
import com.example.kinoprokat.modules.theater.fragments.TheaterMainPageFr;

public class TheaterMainPage extends AppCompatActivity {

    private TheaterMainPageFr mainPageFr;
    private FragmentManager fm;
    private FragmentTransaction ft;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.th_activity_main_page);


        fm = getSupportFragmentManager();
        ft = fm.beginTransaction();
        mainPageFr = new TheaterMainPageFr();
        ft.add(R.id.frame, mainPageFr);
        ft.commit();
    }
}
