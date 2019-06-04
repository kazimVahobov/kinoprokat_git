package com.example.kinoprokat.services;

import retrofit2.Retrofit;

public class NetworkService {

    private static NetworkService mInstance;

    private String BASE_URL = "http://192.168.1.108:8080/api/";
    private Retrofit mRetrofit;
    private String token;
    private String jobId;

    public static NetworkService getInstance() {
        if (mInstance == null) {
            mInstance = new NetworkService();
        }
        return mInstance;
    }

    public String getJobId() {
        return jobId;
    }

    public void setJobId(String jobId) {
        this.jobId = jobId;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getBaseUrl() {
        return BASE_URL;
    }

    public void setBaseUrl(String baseUrl) {
        BASE_URL = baseUrl;
    }
}
