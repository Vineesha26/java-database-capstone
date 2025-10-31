package com.project.back_end.mvc;

import com.project.back_end.services.TokenValidationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Map;

@Controller
public class DashboardController {

    private static final String ADMIN_VIEW = "admin/adminDashboard";
    private static final String DOCTOR_VIEW = "doctor/doctorDashboard";
    private static final String REDIRECT_HOME = "redirect:/";

    private final TokenValidationService tokenValidationService;

    @Autowired
    public DashboardController(TokenValidationService tokenValidationService) {
        this.tokenValidationService = tokenValidationService;
    }

    // Admin dashboard gate (allow dots in JWT: {token:.+})
    @GetMapping("/adminDashboard/{token:.+}")
    public String adminDashboard(@PathVariable("token") String token) {
        if (token == null || token.isBlank()) {
            return REDIRECT_HOME;
        }
        Map<String, String> result = tokenValidationService.validateToken(token, "admin");
        return (result == null || result.isEmpty()) ? ADMIN_VIEW : REDIRECT_HOME;
    }

    // Doctor dashboard gate (allow dots in JWT: {token:.+})
    @GetMapping("/doctorDashboard/{token:.+}")
    public String doctorDashboard(@PathVariable("token") String token) {
        if (token == null || token.isBlank()) {
            return REDIRECT_HOME;
        }
        Map<String, String> result = tokenValidationService.validateToken(token, "doctor");
        return (result == null || result.isEmpty()) ? DOCTOR_VIEW : REDIRECT_HOME;
    }
}
