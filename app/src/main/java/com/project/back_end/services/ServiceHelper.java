package com.project.back_end.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ServiceHelper {

    @Autowired
    private TokenService tokenService;

    public boolean isValidToken(String token, String username) {
        if (token == null || token.isEmpty()) {
            return false;
        }
        return tokenService.validateToken(token, username);
    }

    public String extractUser(String token) {
        if (token == null || token.isEmpty()) {
            return null;
        }
        return tokenService.extractUsername(token);
    }
}
