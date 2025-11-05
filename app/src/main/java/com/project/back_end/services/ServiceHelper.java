package com.project.back_end.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ServiceHelper {

    @Autowired
    private TokenService tokenService;

    public boolean checkToken(String token) {
        return tokenService.isTokenValid(token);
    }

    public String extractUsername(String token) {
        return tokenService.getUsernameFromToken(token);
    }

    public String createToken(String username) {
        return tokenService.generateToken(username);
    }
}
