package com.project.back_end.mvc;

import com.project.back_end.dto.AppointmentDTO;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.ArrayList;
import java.util.List;

@Controller
public class DashboardController {

    @GetMapping("/dashboard")
    public String showDashboard(Model model) {
        List<AppointmentDTO> appointments = new ArrayList<>();

        // Example data
        AppointmentDTO dto = new AppointmentDTO();
        dto.setDoctorName("Dr. Smith");
        dto.setPatientName("John Doe");
        dto.setAppointmentDate("2025-11-05");
        dto.setAppointmentTime("10:00 AM");

        appointments.add(dto);

        model.addAttribute("appointments", appointments);
        return "dashboard";
    }
}
