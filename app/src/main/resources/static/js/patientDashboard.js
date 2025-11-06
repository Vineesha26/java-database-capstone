// app/src/main/resources/static/js/patientDashboard.js

// ---- Imports ----
import { getDoctors, filterDoctors } from './services/doctorServices.js';
import { openModal } from './components/modals.js';
import { createDoctorCard } from './components/doctorCard.js';
import { patientSignup, patientLogin } from './services/patientServices.js';

// ---- DOMContentLoaded: Initial Setup ----
document.addEventListener("DOMContentLoaded", () => {
  loadDoctorCards();

  // Modal triggers
  const signupBtn = document.getElementById("patientSignup");
  if (signupBtn) signupBtn.addEventListener("click", () => openModal("patientSignup"));

  const loginBtn = document.getElementById("patientLogin");
  if (loginBtn) loginBtn.addEventListener("click", () => openModal("patientLogin"));

  // Filter and search bindings
  const searchBar = document.getElementById("searchBar");
  const filterTime = document.getElementById("filterTime");
  const filterSpecialty = document.getElementById("filterSpecialty");

  if (searchBar) searchBar.addEventListener("input", filterDoctorsOnChange);
  if (filterTime) filterTime.addEventListener("change", filterDoctorsOnChange);
  if (filterSpecialty) filterSpecialty.addEventListener("change", filterDoctorsOnChange);
});

// ---- Load all doctors on page load ----
async function loadDoctorCards() {
  try {
    const doctors = await getDoctors();
    renderDoctorCards(doctors);
  } catch (error) {
    console.error("Failed to load doctors:", error);
    document.getElementById("content").innerHTML = "<p>Failed to load doctors. Please try again later.</p>";
  }
}

// ---- Render utility ----
function renderDoctorCards(doctors = []) {
  const contentDiv = document.getElementById("content");
  contentDiv.innerHTML = "";

  if (!doctors || doctors.length === 0) {
    contentDiv.innerHTML = "<p>No doctors available at the moment.</p>";
    return;
  }

  doctors.forEach(doctor => {
    const card = createDoctorCard(doctor);
    contentDiv.appendChild(card);
  });
}

// ---- Search and filter ----
async function filterDoctorsOnChange() {
  const name = document.getElementById("searchBar")?.value.trim() || null;
  const time = document.getElementById("filterTime")?.value || null;
  const specialty = document.getElementById("filterSpecialty")?.value || null;

  try {
    const response = await filterDoctors(name, time, specialty);
    const doctors = response?.doctors || [];
    if (doctors.length > 0) {
      renderDoctorCards(doctors);
    } else {
      document.getElementById("content").innerHTML = "<p>No doctors found with the given filters.</p>";
    }
  } catch (error) {
    console.error("Failed to filter doctors:", error);
    alert("❌ An error occurred while filtering doctors.");
  }
}

// ---- Patient Signup ----
window.signupPatient = async function () {
  try {
    const data = {
      name: document.getElementById("name")?.value || "",
      email: document.getElementById("email")?.value || "",
      password: document.getElementById("password")?.value || "",
      phone: document.getElementById("phone")?.value || "",
      address: document.getElementById("address")?.value || ""
    };

    const { success, message } = await patientSignup(data);
    if (success) {
      alert(message);
      document.getElementById("modal").style.display = "none";
      window.location.reload();
    } else {
      alert(message);
    }
  } catch (error) {
    console.error("Signup failed:", error);
    alert("❌ An error occurred while signing up.");
  }
};

// ---- Patient Login ----
window.loginPatient = async function () {
  try {
    const data = {
      email: document.getElementById("email")?.value || "",
      password: document.getElementById("password")?.value || ""
    };

    const response = await patientLogin(data);
    if (response.ok) {
      const result = await response.json();
      selectRole('loggedPatient'); // sets role for rendering pages
      localStorage.setItem('token', result.token);
      window.location.href = '/pages/loggedPatientDashboard.html';
    } else {
      alert('❌ Invalid credentials!');
    }
  } catch (error) {
    console.error("Login failed:", error);
    alert("❌ Failed to login. Please try again.");
  }
};
