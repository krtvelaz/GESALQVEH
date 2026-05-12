package com.gesalqveh.dashboard.security;

import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class SessionStore {

    public static final String COOKIE_NAME = "SESSION";

    private final Map<String, String> tokens = new ConcurrentHashMap<>();

    public String create(String username) {
        String token = UUID.randomUUID().toString();
        tokens.put(token, username);
        return token;
    }

    public boolean isValid(String token) {
        return token != null && tokens.containsKey(token);
    }

    public void invalidate(String token) {
        if (token != null) tokens.remove(token);
    }
}
