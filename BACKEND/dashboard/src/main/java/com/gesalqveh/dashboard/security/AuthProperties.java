package com.gesalqveh.dashboard.security;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "admin")
public record AuthProperties(String username, String password) {}
