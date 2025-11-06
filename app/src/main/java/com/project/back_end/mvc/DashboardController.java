package com.project.back_end.controllers;

import com.project.back_end.services.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Map;

@Controller
public class DashboardController {

    @Autowired
    private TokenService tokenService;

    // -------------------------
    // Admin Dashboard
    // -------------------------
    @GetMapping("/adminDashboard/{token}")
    public String adminDashboard(@PathVariable("token") String token) {
        // Validate token for admin
        Map<String, Object> validationResult = tokenService.validateToken(token, "admin");

        if (validationResult.isEmpty()) {
            // Token valid → render Thymeleaf admin dashboard
            return "admin/adminDashboard";
        } else {
            // Token invalid → redirect to login
            return "redirect:/";
        }
    }

    // -------------------------
    // Doctor Dashboard
    // -------------------------
    @GetMapping("/doctorDashboard/{token}")
    public String doctorDashboard(@PathVariable("token") String token) {
        // Validate token for doctor
        Map<String, Object> validationResult = tokenService.validateToken(token, "doctor");

        if (validationResult.isEmpty()) {
            // Token valid → render Thymeleaf doctor dashboard
            return "doctor/doctorDashboard";
        } else {
            // Token invalid → redirect to login
            return "redirect:/";
        }
    }
}
