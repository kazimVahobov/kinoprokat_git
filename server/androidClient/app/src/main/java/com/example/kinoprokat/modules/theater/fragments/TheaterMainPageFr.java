package com.example.kinoprokat.modules.theater.fragments;

import android.os.Bundle;
import android.support.design.widget.FloatingActionButton;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;

import com.example.kinoprokat.R;

public class TheaterMainPageFr extends Fragment {

    FloatingActionButton fab_add, fab_option, fab_edit, fab_send, fab_detail;
    Animation anim_fab_open, anim_fab_close, anim_rotate_forward, anim_rotate_backward;
    boolean isOpen = false;
    View mainView;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        mainView = inflater.inflate(R.layout.th_fr_main_page, container, false);
        return mainView;
    }

    @Override
    public void onStart() {
        super.onStart();
        findViews();
    }

    private void findViews() {
        fab_add = (FloatingActionButton) mainView.findViewById(R.id.add);
        fab_option = (FloatingActionButton) mainView.findViewById(R.id.option);
        fab_option.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                animateFabs();
            }
        });
        fab_edit = (FloatingActionButton) mainView.findViewById(R.id.edit);
        fab_send = (FloatingActionButton) mainView.findViewById(R.id.send);
        fab_detail = (FloatingActionButton) mainView.findViewById(R.id.detail);

        anim_fab_open = AnimationUtils.loadAnimation(getContext(), R.anim.fab_open);
        anim_fab_close = AnimationUtils.loadAnimation(getContext(), R.anim.fab_close);
        anim_rotate_forward = AnimationUtils.loadAnimation(getContext(), R.anim.rotate_forward);
        anim_rotate_backward= AnimationUtils.loadAnimation(getContext(), R.anim.rotate_backward);
    }

    private void animateFabs() {
        if (isOpen) {
            fab_option.startAnimation(anim_rotate_backward);
            fab_edit.startAnimation(anim_fab_close);
            fab_send.startAnimation(anim_fab_close);
            fab_detail.startAnimation(anim_fab_close);
            fab_edit.setClickable(false);
            fab_send.setClickable(false);
            fab_detail.setClickable(false);
            isOpen = false;
        } else {
            fab_option.startAnimation(anim_rotate_forward);
            fab_edit.startAnimation(anim_fab_open);
            fab_send.startAnimation(anim_fab_open);
            fab_detail.startAnimation(anim_fab_open);
            fab_edit.setClickable(true);
            fab_send.setClickable(true);
            fab_detail.setClickable(true);
            isOpen = true;
        }
    }
}
