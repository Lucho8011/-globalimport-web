/**
 * Script de validación y control del formulario de registro
 * GlobalImport S.A.
 */

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("registroForm");
  const passwordInput = document.getElementById("password");
  const strengthIndicator = document.getElementById("strengthIndicator");
  const referenciaInput = document.getElementById("referencia");
  const charCountDisplay = document.getElementById("charCount");

  // ===== VALIDADOR DE FORTALEZA DE CONTRASEÑA =====
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
    } else if (strength <= 4) {
      strengthIndicator.classList.add("medium");
    } else {
      strengthIndicator.classList.add("strong");
    }
  }

  // ===== CONTADOR DE CARACTERES =====
  function updateCharCount() {
    const currentLength = referenciaInput.value.length;
    charCountDisplay.textContent = `${currentLength}/200`;
  }

  // ===== LIMPIAR ERRORES DE CAMPOS =====
  function clearFieldErrors() {
    const formGroups = document.querySelectorAll(".form-group.error");
    formGroups.forEach((group) => {
      group.classList.remove("error");
      const errorText = group.querySelector(".error-text");
      if (errorText) {
        errorText.remove();
      }
    });
  }

  // ===== MARCAR CAMPO CON ERROR =====
  function markFieldError(fieldId, errorMessage) {
    const field = document.getElementById(fieldId);
    if (field) {
      const formGroup = field.closest(".form-group");
      if (formGroup) {
        formGroup.classList.add("error");
        // Remover error-text anterior si existe
        const existingError = formGroup.querySelector(".error-text");
        if (existingError) {
          existingError.remove();
        }
        // Crear y añadir mensaje de error
        const errorText = document.createElement("span");
        errorText.className = "error-text";
        errorText.textContent = errorMessage;
        formGroup.appendChild(errorText);
      }
    }
  }

  // ===== VALIDACIÓN PERSONALIZADA =====
  function validateForm(e) {
    let isValid = true;
    const errors = [];
    clearFieldErrors();

    // Email coincidencia
    const email = document.getElementById("email").value.trim();
    const emailConfirm = document.getElementById("emailConfirm").value.trim();
    if (email !== emailConfirm) {
      isValid = false;
      errors.push("Los correos electrónicos no coinciden");
      markFieldError("emailConfirm", "Los correos no coinciden");
    }

    // Validar que email no esté vacío
    if (!email) {
      isValid = false;
      errors.push("El correo electrónico es requerido");
      markFieldError("email", "Campo requerido");
    }

    // Contraseña coincidencia
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("passwordConfirm").value;
    if (password !== passwordConfirm) {
      isValid = false;
      errors.push("Las contraseñas no coinciden");
      markFieldError("passwordConfirm", "Las contraseñas no coinciden");
    }

    // Validar fortaleza de contraseña
    const strength = evaluatePasswordStrength(password);
    if (strength < 3) {
      isValid = false;
      errors.push(
        "La contraseña es muy débil. Debe incluir mayúsculas, minúsculas, números y caracteres especiales"
      );
      markFieldError("password", "Contraseña muy débil");
    }

    // Validar que al menos una categoría esté seleccionada
    const categorias = document.querySelectorAll(
      'input[name="categorias"]:checked'
    );
    if (categorias.length === 0) {
      isValid = false;
      errors.push("Debes seleccionar al menos una categoría de interés");
    }

    // Validar que se acepten términos
    const terminos = document.getElementById("registroForm").querySelector(
      'input[name="terminos"]'
    );
    if (!terminos.checked) {
      isValid = false;
      errors.push("Debes aceptar los Términos y Condiciones");
    }

    // Validar que se acepte política de privacidad
    const privacidad = document.getElementById("registroForm").querySelector(
      'input[name="privacidad"]'
    );
    if (!privacidad.checked) {
      isValid = false;
      errors.push("Debes aceptar la Política de Privacidad");
    }

    if (!isValid) {
      e.preventDefault();
      showErrors(errors);
    }

    return isValid;
  }

  function showErrors(errors) {
    // Crear contenedor de errores si no existe
    let errorContainer = document.querySelector(".error-container");
    if (!errorContainer) {
      errorContainer = document.createElement("div");
      errorContainer.className = "error-container";
      form.insertBefore(errorContainer, form.firstChild);
    }

    errorContainer.innerHTML = "";
    errorContainer.style.display = "block";

    const errorMessage = document.createElement("div");
    errorMessage.className = "error-message";
    errorMessage.innerHTML = `
      <strong>⚠️ Por favor corrige los siguientes errores:</strong>
      <ul>
        ${errors.map((error) => `<li>${error}</li>`).join("")}
      </ul>
    `;
    errorContainer.appendChild(errorMessage);

    // Scroll al contenedor de errores
    errorContainer.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // ===== EVENT LISTENERS =====
  if (passwordInput) {
    passwordInput.addEventListener("input", updatePasswordStrength);
  }

  if (referenciaInput) {
    referenciaInput.addEventListener("input", updateCharCount);
  }

  if (form) {
    form.addEventListener("submit", validateForm);

    // Limpiar errores cuando el usuario comienza a escribir
    form.addEventListener("input", function (e) {
      const errorContainer = document.querySelector(".error-container");
      if (
        errorContainer &&
        errorContainer.style.display === "block" &&
        e.target.closest(".form-group")
      ) {
        const formGroup = e.target.closest(".form-group");
        formGroup.classList.remove("error");
        const errorText = formGroup.querySelector(".error-text");
        if (errorText) {
          errorText.remove();
        }
      }
    });
  }

  // Inicializar contador de caracteres
  if (referenciaInput) {
    updateCharCount();
  }

  // Agregar estilos para el contenedor de errores dinámicamente
  const style = document.createElement("style");
  style.textContent = `
    .error-container {
      background: #fee;
      border: 2px solid #e74c3c;
      border-radius: 10px;
      padding: 1.5rem;
      margin-bottom: 2rem;
      display: none;
      animation: fadeIn 0.3s ease;
    }

    .error-message {
      color: #c0392b;
    }

    .error-message strong {
      display: block;
      margin-bottom: 0.8rem;
      font-size: 1rem;
    }

    .error-message ul {
      list-style: none;
      padding-left: 0;
      margin: 0;
    }

    .error-message li {
      padding: 0.4rem 0;
      padding-left: 1.5rem;
      position: relative;
    }

    .error-message li::before {
      content: "✗";
      position: absolute;
      left: 0;
      font-weight: bold;
    }

    /* Mejoras en accesibilidad para campos con focus-visible */
    .form-group input:focus-visible,
    .form-group select:focus-visible,
    .form-group textarea:focus-visible {
      outline: 2px solid var(--color-accent);
      outline-offset: 2px;
    }

    .form-group.error input:focus-visible,
    .form-group.error select:focus-visible,
    .form-group.error textarea:focus-visible {
      outline: 2px solid #c0392b;
    }
  `;
  document.head.appendChild(style);
});

/**
 * Función auxiliar para aplicar máscara a teléfono (opcional)
 * Puede descomentarse si se desea una máscara de teléfono
 */
function maskPhoneNumber(input) {
  let value = input.value.replace(/\D/g, "");
  if (value.length <= 2) {
    value = value;
  } else if (value.length <= 7) {
    value = value.slice(0, 2) + " " + value.slice(2);
  } else {
    value = value.slice(0, 2) + " " + value.slice(2, 7) + " " + value.slice(7);
  }
  input.value = value;
}

// Descomenta la siguiente línea para usar máscara de teléfono
// document.getElementById('telefono')?.addEventListener('input', function() { maskPhoneNumber(this); });
