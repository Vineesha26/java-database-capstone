// app/src/main/resources/static/js/adminDashboard.js

// ---- Imports ----
import { openModal } from "./components/modals.js";
import { getDoctors, filterDoctors, saveDoctor } from "./services/doctorServices.js";
import { createDoctorCard } from "./components/doctorCard.js";

// ---- Bootstrapping ----
document.addEventListener("DOMContentLoaded", () => {
  // Bind “Add Doctor” button (support both ids seen across pages)
  const addBtn = document.getElementById("addDocBtn") || document.getElementById("openAddDoctorModal");
  if (addBtn) {
    addBtn.addEventListener("click", () => openModal("addDoctor"));
  }

  // Search & filter bindings (support both `filterTime` and `sortByTime`)
  const searchBar = document.getElementById("searchBar");
  const timeFilter = document.getElementById("filterTime") || document.getElementById("sortByTime");
  const specialtyFilter = document.getElementById("filterSpecialty");

  if (searchBar) searchBar.addEventListener("input", filterDoctorsOnChange);
  if (timeFilter) timeFilter.addEventListener("change", filterDoctorsOnChange);
  if (specialtyFilter) specialtyFilter.addEventListener("change", filterDoctorsOnChange);

  // Submit/Cancel inside dynamically-rendered Add Doctor modal
  document.addEventListener("click", async (e) => {
    const target = e.target;

    // Save/Add doctor
    if (target && target.id === "saveAddDoctor") {
      e.preventDefault();
      await adminAddDoctor();
    }

    // Optional: close modal by button id used in HTML
    if (target && (target.id === "cancelAddDoctor" || target.id === "closeAddDoctor")) {
      hideModal();
    }
  });

  // Initial load
  loadDoctorCards();
});

// ---- Data loading & rendering ----
async function loadDoctorCards() {
  const contentDiv = document.getElementById("content");
  if (!contentDiv) return;
  contentDiv.innerHTML = "Loading doctors…";

  const doctors = await getDoctors();
  renderDoctorCards(doctors);
}

function renderDoctorCards(doctors = []) {
  const contentDiv = document.getElementById("content");
  if (!contentDiv) return;
  contentDiv.innerHTML = "";

  if (!doctors || doctors.length === 0) {
    const empty = document.createElement("div");
    empty.className = "noPatientRecord";
    empty.textContent = "No doctors found";
    contentDiv.appendChild(empty);
    return;
  }

  doctors.forEach((doc) => {
    // Normalize properties for the card if needed
    const normalized = {
      ...doc,
      availability: doc.availableTimes || doc.availability || [], // support both names
    };
    const card = createDoctorCard(normalized);
    contentDiv.appendChild(card);
  });
}

// ---- Search / Filter ----
async function filterDoctorsOnChange() {
  const name = (document.getElementById("searchBar")?.value || "").trim();
  const time =
    document.getElementById("filterTime")?.value ||
    document.getElementById("sortByTime")?.value ||
    "";
  const specialty = document.getElementById("filterSpecialty")?.value || "";

  const results = await filterDoctors(name, time, specialty);
  renderDoctorCards(results);
}

// ---- Add Doctor (Modal) ----
async function adminAddDoctor() {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in as Admin to add a doctor.");
      return;
    }

    // Collect form fields (support both simple text input and checkbox list for availability)
    const name = document.getElementById("docName")?.value?.trim() || "";
    const email = document.getElementById("docEmail")?.value?.trim() || "";
    const password = document.getElementById("docPassword")?.value || "";
    const phone = document.getElementById("docPhone")?.value?.trim() || "";
    const specialty = document.getElementById("docSpecialty")?.value?.trim() || "";

    // Availability: support CSV input (#docTimes) or checkboxes (.avail-checkbox)
    let availableTimes = [];
    const timesInput = document.getElementById("docTimes")?.value || "";
    const checkboxNodes = document.querySelectorAll(".avail-checkbox");
    if (checkboxNodes && checkboxNodes.length > 0) {
      availableTimes = Array.from(checkboxNodes)
        .filter((c) => c.checked && c.value)
        .map((c) => c.value.trim());
    } else if (timesInput) {
      availableTimes = timesInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }

    // Basic validations (adjust as needed)
    if (!name || !email || !password || !phone || !specialty) {
      alert("Please fill in all required fields.");
      return;
    }

    const doctorPayload = {
      name,
      email,
      password,
      phone,
      specialty,
      availableTimes,
    };

    const result = await saveDoctor(doctorPayload, token);
    if (result.success) {
      alert("Doctor added successfully.");
      hideModal();
      await loadDoctorCards(); // refresh list
    } else {
      alert(result.message || "Failed to add doctor.");
    }
  } catch (err) {
    console.error("adminAddDoctor error:", err);
    alert("An unexpected error occurred while adding the doctor.");
  }
}

// ---- Modal helpers ----
function hideModal() {
  const modal = document.getElementById("modal");
  if (modal) modal.style.display = "none";
}
