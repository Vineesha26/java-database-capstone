// app/src/main/resources/static/js/components/doctorCard.js

import { deleteDoctor } from "../services/doctorServices.js";
import { getPatientData } from "../services/patientServices.js";
import { showBookingOverlay } from "./modals.js";

export function createDoctorCard(doctor) {
  // Main container
  const card = document.createElement("div");
  card.classList.add("doctor-card");

  // Fetch current role
  const role = localStorage.getItem("userRole");

  // Doctor info container
  const infoDiv = document.createElement("div");
  infoDiv.classList.add("doctor-info");

  // Create info elements
  const name = document.createElement("h3");
  name.textContent = doctor.name || "Unnamed Doctor";

  const specialization = document.createElement("p");
  specialization.textContent = `Specialty: ${doctor.specialty || "General"}`;

  const email = document.createElement("p");
  email.textContent = `Email: ${doctor.email || "Not provided"}`;

  const availability = document.createElement("p");
  if (doctor.availability && Array.isArray(doctor.availability)) {
    availability.textContent = `Available: ${doctor.availability.join(", ")}`;
  } else {
    availability.textContent = `Available: ${doctor.availability || "Unknown"}`;
  }

  // Append doctor info
  infoDiv.appendChild(name);
  infoDiv.appendChild(specialization);
  infoDiv.appendChild(email);
  infoDiv.appendChild(availability);

  // Actions container
  const actionsDiv = document.createElement("div");
  actionsDiv.classList.add("card-actions");

  // Conditional buttons by role
  if (role === "admin") {
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Delete";
    removeBtn.classList.add("btn", "delete-btn");

    removeBtn.addEventListener("click", async () => {
      const confirmDelete = confirm(`Are you sure you want to delete Dr. ${doctor.name}?`);
      if (!confirmDelete) return;

      const token = localStorage.getItem("token");
      try {
        const success = await deleteDoctor(doctor.id, token);
        if (success) {
          alert(`Doctor ${doctor.name} removed successfully.`);
          card.remove();
        } else {
          alert("Failed to delete doctor. Please try again.");
        }
      } catch (err) {
        console.error("Error deleting doctor:", err);
        alert("An error occurred while deleting the doctor.");
      }
    });

    actionsDiv.appendChild(removeBtn);
  } 
  else if (role === "patient") {
    const bookNow = document.createElement("button");
    bookNow.textContent = "Book Now";
    bookNow.classList.add("btn", "book-btn");

    bookNow.addEventListener("click", () => {
      alert("Please log in to book an appointment.");
    });

    actionsDiv.appendChild(bookNow);
  } 
  else if (role === "loggedPatient") {
    const bookNow = document.createElement("button");
    bookNow.textContent = "Book Now";
    bookNow.classList.add("btn", "book-btn");

    bookNow.addEventListener("click", async (e) => {
      const token = localStorage.getItem("token");
      try {
        const patientData = await getPatientData(token);
        showBookingOverlay(e, doctor, patientData);
      } catch (error) {
        console.error("Error fetching patient data:", error);
        alert("Unable to fetch patient details. Please try again.");
      }
    });

    actionsDiv.appendChild(bookNow);
  }

  // Assemble the card
  card.appendChild(infoDiv);
  card.appendChild(actionsDiv);

  return card;
}
