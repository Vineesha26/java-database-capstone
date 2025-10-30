// app/src/main/resources/static/js/components/header.js

(function () {
  /**
   * Renders the role-aware header into #header.
   * - Skips role header on homepage (/)
   * - Validates role+token for protected roles
   * - Injects role-specific actions
   * - Attaches listeners after injection
   */
  function renderHeader() {
    const headerDiv = document.getElementById("header");
    if (!headerDiv) return;

    // 1) Skip role header on homepage and clear session (per hint)
    const isHome = window.location.pathname.endsWith("/") || window.location.pathname.endsWith("/index.html");
    if (isHome) {
      localStorage.removeItem("userRole");
      localStorage.removeItem("token");
      headerDiv.innerHTML = basicBrandHeader();
      return;
    }

    // 2) Read role + token to decide which header to show
    const role = localStorage.getItem("userRole");       // "admin" | "doctor" | "patient" | "loggedPatient"
    const token = localStorage.getItem("token");

    // 3) Guard: protected roles without token -> reset + redirect
    if ((role === "loggedPatient" || role === "admin" || role === "doctor") && !token) {
      localStorage.removeItem("userRole");
      alert("Session expired or invalid login. Please log in again.");
      window.location.href = "/";
      return;
    }

    // 4) Build role-specific header
    let headerContent = `
      <div class="header">
        <div class="logo" role="banner" style="font-weight:800">Smart Clinic</div>
        <nav class="nav" aria-label="Primary">`;

    if (role === "admin") {
      headerContent += `
          <button id="addDocBtn" class="adminBtn" type="button" onclick="openModal && openModal('addDoctor')">Add Doctor</button>
          <button id="logoutBtn" class="btn" type="button">Logout</button>`;
    } else if (role === "doctor") {
      headerContent += `
          <button id="homeBtn" class="btn" type="button">Home</button>
          <button id="logoutBtn" class="btn" type="button">Logout</button>`;
    } else if (role === "loggedPatient") {
      headerContent += `
          <button id="homeBtn" class="btn" type="button">Home</button>
          <button id="appointmentsBtn" class="btn" type="button">Appointments</button>
          <button id="logoutPatientBtn" class="btn" type="button">Logout</button>`;
    } else {
      // default to anonymous patient header
      headerContent += `
          <button id="loginBtn" class="btn" type="button">Login</button>
          <button id="signupBtn" class="btn" type="button">Sign Up</button>`;
      // ensure we reflect anonymous state
      localStorage.setItem("userRole", "patient");
    }

    headerContent += `</nav></div>`;

    // 5) Inject header and attach listeners
    headerDiv.innerHTML = headerContent;
    attachHeaderButtonListeners();
  }

  /**
   * Minimal brand-only header for homepage (no role controls).
   */
  function basicBrandHeader() {
    return `
      <div class="header">
        <div class="logo" role="banner" style="font-weight:800">Smart Clinic</div>
        <nav class="nav" aria-label="Primary"></nav>
      </div>`;
  }

  /**
   * Wire up click handlers after dynamic DOM injection.
   */
  function attachHeaderButtonListeners() {
    const homeBtn = document.getElementById("homeBtn");
    const logoutBtn = document.getElementById("logoutBtn");
    const logoutPatientBtn = document.getElementById("logoutPatientBtn");
    const loginBtn = document.getElementById("loginBtn");
    const signupBtn = document.getElementById("signupBtn");
    const appointmentsBtn = document.getElementById("appointmentsBtn");

    // HOME
    if (homeBtn) {
      homeBtn.addEventListener("click", () => {
        const role = localStorage.getItem("userRole");
        if (role === "doctor") {
          window.location.href = "/doctor/doctorDashboard";
        } else if (role === "loggedPatient") {
          window.location.href = "/pages/patientDashboard.html";
        } else if (role === "admin") {
          window.location.href = "/admin/adminDashboard";
        } else {
          window.location.href = "/";
        }
      });
    }

    // APPOINTMENTS (patient)
    if (appointmentsBtn) {
      appointmentsBtn.addEventListener("click", () => {
        // Route to a patient appointments page if present
        window.location.href = "/pages/patientAppointments.html";
      });
    }

    // LOGOUT (admin/doctor)
    if (logoutBtn) logoutBtn.addEventListener("click", logout);

    // LOGOUT (patient -> keep role as 'patient')
    if (logoutPatientBtn) logoutPatientBtn.addEventListener("click", logoutPatient);

    // LOGIN / SIGNUP (anonymous patient)
    if (loginBtn) {
      loginBtn.addEventListener("click", () => {
        // If you use a modal login, call openModal('login') instead:
        // openModal && openModal('login');
        window.location.href = "/login.html";
      });
    }
    if (signupBtn) {
      signupBtn.addEventListener("click", () => {
        // openModal && openModal('signup');
        window.location.href = "/signup.html";
      });
    }
  }

  /**
   * Logout admin/doctor: clear token & role, go home.
   */
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    window.location.href = "/";
  }

  /**
   * Logout patient: clear token, demote to 'patient', go patient dashboard (or home).
   */
  function logoutPatient() {
    localStorage.removeItem("token");
    localStorage.setItem("userRole", "patient");
    // Send to patient dashboard landing (adjust path if you serve from templates)
    window.location.href = "/pages/patientDashboard.html";
  }

  // Optional global hook for opening modals used by header buttons
  // Your modal implementation elsewhere can overwrite this.
  window.openModal = window.openModal || function (key) {
    // stub: replace with real modal logic
    const modal = document.getElementById("modal");
    const body = document.getElementById("modal-body");
    if (modal && body) {
      body.innerHTML = `<h3 style="margin:0 0 10px;">${key === 'addDoctor' ? 'Add Doctor' : 'Modal'}</h3>
                        <p>Implement modal content for: <strong>${key}</strong></p>`;
      modal.style.display = "block";
    }
  };

  // Expose & auto-run after DOM is ready
  window.renderHeader = renderHeader;
  document.addEventListener("DOMContentLoaded", renderHeader);
})();
