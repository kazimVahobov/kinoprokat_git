package com.example.kinoprokat.interfaces;

import com.example.kinoprokat.models.Login;
import com.example.kinoprokat.models.Role;
import com.example.kinoprokat.models.Token;
import com.example.kinoprokat.models.User;

import java.util.List;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.Path;

public interface Apies {

    // user APIs ////////////////////////////////////
    @POST("user/login")
    public Call<Token> login(@Body Login login);

    @GET("user/{id}")
    public Call<User> getUserById(@Path("id") String id);

    // role APIs ////////////////////////////////////
    @GET("role")
    public Call<List<Role>> getRoles();

    @GET("role/{id}")
    public Call<Role> getRoleById(@Path("id") String id);
}
