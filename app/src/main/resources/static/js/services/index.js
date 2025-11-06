// app/src/main/resources/static/js/services/index.js

// --- Imports ---
import { openModal } from "../components/modals.js";
import { API_BASE_URL } from "../config/config.js";

// --- API endpoints ---
const ADMIN_API = `${API_BASE_URL}/admin`;
const DOCTOR_API = `${API_BASE_URL}/doctor/login`;

// Expose endpoints globally for debugging if needed
window.__ENDPOINTS__ = { ADMIN_API, DOCTOR_API };

// --- Helper to POST JSON ---
async function postJson(url, payload) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res;
}

// --- Admin Login Handler ---
async function adminLoginHandler() {
  try {
    const usernameEl = document.getElementById("adminUsername");
    const passwordEl = document.getElementById("adminPassword");

    const username = usernameEl?.value?.trim() || "";
    const password = passwordEl?.value || "";

    const admin = { username, password };

    const res = await postJson(ADMIN_API, admin);

    if (res.ok) {
      const data = await res.json();
      const token = data.token || data.accessToken || data.jwt;
      if (!token) throw new Error("No token returned from server");

      localStorage.setItem("token", token);

      if (typeof window.selectRole === "function") {
        window.selectRole("ADMIN");
      } else {
        localStorage.setItem("userRole", "admin");
      }

      alert("Admin login successful.");
    } else {
      alert("Invalid credentials!");
    }
  } catch (err) {
    console.error("Admin login error:", err);
    alert("Login failed. Please try again.");
  }
}
window.adminLoginHandler = adminLoginHandler; // Expose globally

// --- Doctor Login Handler ---
async function doctorLoginHandler() {
  try {
    const emailEl = document.getElementById("doctorEmail");
    const passwordEl = document.getElementById("doctorPassword");

    const email = emailEl?.value?.trim() || "";
    const password = passwordEl?.value || "";

    const doctor = { email, password };

    const res = await postJson(DOCTOR_API, doctor);

    if (res.ok) {
      const data = await res.json();
      const token = data.token || data.accessToken || data.jwt;
      if (!token) throw new Error("No token returned from server");

      localStorage.setItem("token", token);

      if (typeof window.selectRole === "function") {
        window.selectRole("DOCTOR");
      } else {
        localStorage.setItem("userRole", "doctor");
      }

      alert("Doctor login successful.");
    } else {
      alert("Invalid credentials!");
    }
  } catch (err) {
    console.error("Doctor login error:", err);
    alert("Login failed. Please try again.");
  }
}
window.doctorLoginHandler = doctorLoginHandler; // Expose globally

// --- Wire buttons after load ---
window.addEventListener("DOMContentLoaded", () => {
  const adminBtn = document.getElementById("adminLogin");
  if (adminBtn) {
    adminBtn.addEventListener("click", () => openModal("adminLogin"));
  }

  const doctorBtn = document.getElementById("doctorLogin");
  if (doctorBtn) {
    doctorBtn.addEventListener("click", () => openModal("doctorLogin"));
  }
});
