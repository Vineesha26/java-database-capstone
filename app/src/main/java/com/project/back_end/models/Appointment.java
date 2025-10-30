package com.project.back_end.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Auto-incremented primary key

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    @NotNull(message = "Doctor is required")
    private Doctor doctor; // Assigned doctor

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    @NotNull(message = "Patient is required")
    private Patient patient; // Assigned patient

    @NotNull(message = "Appointment time is required")
    @Future(message = "Appointment time must be in the future")
    @Column(name = "appointment_time", nullable = false)
    private LocalDateTime appointmentTime; // Start datetime

    /**
     * Status of the appointment:
     * 0 = Scheduled, 1 = Completed
     */
    @Min(value = 0, message = "Status must be 0 (Scheduled) or 1 (Completed)")
    @Max(value = 1, message = "Status must be 0 (Scheduled) or 1 (Completed)")
    @Column(nullable = false)
    private int status;

    // ---- Constructors ----
    public Appointment() {}

    public Appointment(Doctor doctor, Patient patient, LocalDateTime appointmentTime, int status) {
        this.doctor = doctor;
        this.patient = patient;
        this.appointmentTime = appointmentTime;
        this.status = status;
    }

    // ---- Helper methods (not persisted) ----

    /**
     * Returns the end time of the appointment (1 hour after start).
     */
    @Transient
    public LocalDateTime getEndTime() {
        return (appointmentTime == null) ? null : appointmentTime.plusHours(1);
        // If you want a 60-minute slot precisely, plusMinutes(60) also works.
    }

    /**
     * Returns only the date portion of the appointment.
     */
    @Transient
    public LocalDate getAppointmentDate() {
        return (appointmentTime == null) ? null : appointmentTime.toLocalDate();
    }

    /**
     * Returns only the time portion of the appointment.
     */
    @Transient
    public LocalTime getAppointmentTimeOnly() {
        return (appointmentTime == null) ? null : appointmentTime.toLocalTime();
    }

    // ---- Getters & Setters ----

    public Long getId() {
        return id;
    }

    public void setId(Long id) { // usually managed by JPA
        this.id = id;
    }

    public Doctor getDoctor() {
        return doctor;
    }

    public void setDoctor(Doctor doctor) {
        this.doctor = doctor;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    public LocalDateTime getAppointmentTime() {
        return appointmentTime;
    }

    public void setAppointmentTime(LocalDateTime appointmentTime) {
        this.appointmentTime = appointmentTime;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    // ---- toString (avoid loading LAZY relations deeply) ----
    @Override
    public String toString() {
        return "Appointment{" +
                "id=" + id +
                ", doctorId=" + (doctor != null ? doctor.getId() : null) +
                ", patientId=" + (patient != null ? patient.getId() : null) +
                ", appointmentTime=" + appointmentTime +
                ", status=" + status +
                '}';
    }
}
