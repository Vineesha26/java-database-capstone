// app/src/main/resources/static/js/components/footer.js

function renderFooter() {
  const footer = document.getElementById("footer");
  if (!footer) return; // No footer container found

  footer.innerHTML = `
    <footer class="footer">
      <div class="footer-wrapper">
        <!-- Branding -->
        <div class="footer-logo">
          <img src="../assets/images/logo.png" alt="Clinic Logo" class="footer-img" />
          <p>© ${new Date().getFullYear()} Smart Clinic. All rights reserved.</p>
        </div>

        <!-- Footer Columns -->
        <div class="footer-columns">
          <!-- Company -->
          <div class="footer-column">
            <h4>Company</h4>
            <a href="#">About Us</a>
            <a href="#">Careers</a>
            <a href="#">Press</a>
          </div>

          <!-- Support -->
          <div class="footer-column">
            <h4>Support</h4>
            <a href="#">Account</a>
            <a href="#">Help Center</a>
            <a href="#">Contact</a>
          </div>

          <!-- Legal -->
          <div class="footer-column">
            <h4>Legal</h4>
            <a href="#">Terms</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Licensing</a>
          </div>
        </div>
      </div>
    </footer>
  `;
}

// Call immediately when the file loads
renderFooter();
