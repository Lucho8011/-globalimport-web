/**
 * Script complementario de registro - Funcionalidades visuales
 * GlobalImport S.A.
 * Las validaciones principales se encuentran en validaciones.js
 */

document.addEventListener("DOMContentLoaded", function () {
  const passwordInput = document.getElementById("password");
  const strengthIndicator = document.getElementById("strengthIndicator");
  const referenciaInput = document.getElementById("referencia");
  const charCountDisplay = document.getElementById("charCount");

  // ===== INDICADOR DE FORTALEZA DE CONTRASEÑA =====
  function evaluatePasswordStrength(password) {
    let strength = 0;

    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength++;

    return strength;
  }

  function updatePasswordStrength() {
    const password = passwordInput.value;
    const strength = evaluatePasswordStrength(password);

    strengthIndicator.classList.remove("weak", "medium", "strong");

    if (strength <= 2) {
      strengthIndicator.classList.add("weak");
      strengthIndicator.title = "Contraseña débil";
    } else if (strength <= 4) {
      strengthIndicator.classList.add("medium");
      strengthIndicator.title = "Contraseña moderada";
    } else {
      strengthIndicator.classList.add("strong");
      strengthIndicator.title = "Contraseña fuerte";
    }
  }

  // ===== CONTADOR DE CARACTERES =====
  function updateCharCount() {
    const currentLength = referenciaInput.value.length;
    charCountDisplay.textContent = `${currentLength}/200`;
    
    // Cambiar color si se acerca al límite
    if (currentLength > 180) {
      charCountDisplay.style.color = "#f39c12";
    } else if (currentLength > 200) {
      charCountDisplay.style.color = "#e74c3c";
    } else {
      charCountDisplay.style.color = "rgba(11, 31, 51, 0.6)";
    }
  }

  // ===== EVENT LISTENERS =====
  if (passwordInput) {
    passwordInput.addEventListener("input", updatePasswordStrength);
    updatePasswordStrength(); // Inicializar
  }

  if (referenciaInput) {
    referenciaInput.addEventListener("input", updateCharCount);
    updateCharCount(); // Inicializar
  }

  // Feedback visual en validación de email
  const emailInput = document.getElementById("email");
  if (emailInput) {
    emailInput.addEventListener("blur", function () {
      const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (this.value && regexEmail.test(this.value)) {
        this.style.borderColor = "#27ae60";
      } else if (this.value) {
        this.style.borderColor = "#e74c3c";
      } else {
        this.style.borderColor = "rgba(11, 31, 51, 0.15)";
      }
    });

    emailInput.addEventListener("focus", function () {
      this.style.borderColor = "var(--color-accent)";
    });
  }

  // Limpiar estilos de validación cuando el usuario escribe
  const campos = document.querySelectorAll("input, select, textarea");
  campos.forEach((campo) => {
    campo.addEventListener("input", function () {
      if (this.id === "email") {
        this.style.borderColor = "rgba(11, 31, 51, 0.15)";
      }
    });
  });
});
