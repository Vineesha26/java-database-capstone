// app/src/main/resources/static/js/doctorDashboard.js

// ---- Imports ----
import { getAllAppointments } from "./services/appointmentRecordService.js";
import { createPatientRow } from "./components/patientRows.js";

// ---- Globals ----
const tbody = document.getElementById("patientTableBody");
let selectedDate = todayISO();
let token = localStorage.getItem("token");
let patientName = null; // null means no filter

// ---- Utilities ----
function todayISO() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

function setDatePicker(value) {
  const dateInput = document.getElementById("datePicker");
  if (dateInput) dateInput.value = value;
}

function ensureAuth() {
  if (!token) {
    alert("Your session has expired. Please log in again.");
    window.location.href = "/"; // or doctor login page
    return false;
  }
  return true;
}

// ---- Search Bar ----
const searchBar = document.getElementById("searchBar");
if (searchBar) {
  searchBar.addEventListener("input", async (e) => {
    const val = (e.target.value || "").trim();
    patientName = val.length ? val : "null";
    await loadAppointments();
  });
}

// ---- Filter Controls ----
const todayBtn = document.getElementById("todayButton") || document.getElementById("btnToday");
if (todayBtn) {
  todayBtn.addEventListener("click", async () => {
    selectedDate = todayISO();
    setDatePicker(selectedDate);
    await loadAppointments();
  });
}

const datePicker = document.getElementById("datePicker");
if (datePicker) {
  if (!datePicker.value) datePicker.value = selectedDate;
  datePicker.addEventListener("change", async (e) => {
    selectedDate = e.target.value || todayISO();
    await loadAppointments();
  });
}

// ---- Core Loader ----
export async function loadAppointments() {
  if (!ensureAuth()) return;
  if (!tbody) return;

  tbody.innerHTML = `<tr><td colspan="5" style="padding:12px;">Loading appointments…</td></tr>`;

  try {
    const nameForQuery = patientName === null ? "null" : patientName;
    const appts = await getAllAppointments(selectedDate, nameForQuery, token);

    tbody.innerHTML = "";

    if (!appts || appts.length === 0) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = 5;
      td.style.padding = "12px";
      td.textContent = "No appointments found for the selected date.";
      tr.appendChild(td);
      tbody.appendChild(tr);
      return;
    }

    appts.forEach((appt) => {
      const row = createPatientRow(appt);
      tbody.appendChild(row);
    });
  } catch (err) {
    console.error("loadAppointments error:", err);
    tbody.innerHTML = "";
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 5;
    td.style.padding = "12px";
    td.textContent = "Something went wrong while loading appointments. Please try again.";
    tr.appendChild(td);
    tbody.appendChild(tr);
  }
}

// ---- Initial Render ----
document.addEventListener("DOMContentLoaded", async () => {
  if (typeof window.renderContent === "function") {
    try { window.renderContent(); } catch (e) { console.warn("renderContent failed:", e); }
  }

  setDatePicker(selectedDate);
  await loadAppointments();
});
