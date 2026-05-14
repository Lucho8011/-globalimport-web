/**
 * validaciones.js - Sistema de validaciones del formulario de registro
 * GlobalImport S.A.
 * Intercepta el envío del formulario y aplica validaciones del lado del cliente
 */

class FormValidator {
  constructor(formId) {
    this.form = document.getElementById(formId);
    this.errores = {};
    this.camposValidos = {};
    this.init();
  }

  init() {
    if (this.form) {
      this.form.addEventListener("submit", (e) => this.handleSubmit(e));
      this.agregarEscuchadoresBlur();
      this.agregarEscuchadoresInput();
    }
  }

  /**
   * Maneja el evento submit del formulario
   */
  handleSubmit(e) {
    e.preventDefault();
    this.errores = {};
    this.limpiarErroresUI();

    // Ejecutar todas las validaciones
    this.validarDatosPersonales();
    this.validarContactoAcceso();
    this.validarDireccion();
    this.validarPreferenciasTerminos();

    // Si hay errores, mostrar y no enviar
    if (Object.keys(this.errores).length > 0) {
      this.mostrarErrores();
      return false;
    }

    // Si no hay errores, mostrar mensaje de éxito
    this.mostrarMensajeExito();
    return false;
  }

  /**
   * VALIDACIONES DE DATOS PERSONALES
   */
  validarDatosPersonales() {
    this.validarNombre();
    this.validarFechaNacimiento();
    this.validarRut();
    this.validarGenero();
    this.validarNacionalidad();
  }

  validarNombre() {
    const nombre = document.getElementById("nombre").value.trim();
    const regexNombre = /^[a-záéíóúñ\s]{3,60}$/i;

    if (!nombre) {
      this.agregarError("nombre", "El nombre completo es requerido");
      this.marcarCampoError("nombre");
    } else if (!regexNombre.test(nombre)) {
      this.agregarError(
        "nombre",
        "Solo letras y espacios. Mínimo 3, máximo 60 caracteres"
      );
      this.marcarCampoError("nombre");
    } else {
      this.marcarCampoOk("nombre");
    }
  }

  validarFechaNacimiento() {
    const fecha = document.getElementById("fechaNacimiento").value;

    if (!fecha) {
      this.agregarError("fechaNacimiento", "La fecha de nacimiento es requerida");
      this.marcarCampoError("fechaNacimiento");
      return;
    }

    const fechaObj = new Date(fecha);
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaObj.getFullYear();
    const mes = hoy.getMonth() - fechaObj.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaObj.getDate())) {
      edad--;
    }

    if (edad < 18) {
      this.agregarError(
        "fechaNacimiento",
        "Debes ser mayor de 18 años para registrarte"
      );
      this.marcarCampoError("fechaNacimiento");
    } else if (edad > 120) {
      this.agregarError(
        "fechaNacimiento",
        "La fecha de nacimiento no es válida"
      );
      this.marcarCampoError("fechaNacimiento");
    } else {
      this.marcarCampoOk("fechaNacimiento");
    }
  }

  validarRut() {
    const rut = document.getElementById("rut").value.trim();
    const regexRut = /^\d{7,8}$/;

    if (!rut) {
      this.agregarError("rut", "El RUT es requerido");
      this.marcarCampoError("rut");
      return;
    }

    if (!regexRut.test(rut.replace(/\./g, "").replace(/-/g, ""))) {
      this.agregarError("rut", "RUT inválido. Solo números, 7-8 dígitos");
      this.marcarCampoError("rut");
      return;
    }

    if (!this.validarRutChileno(rut)) {
      this.agregarError("rut", "El RUT chileno no es válido");
      this.marcarCampoError("rut");
    } else {
      this.marcarCampoOk("rut");
    }
  }

  validarRutChileno(rut) {
    // Limpiar formato
    rut = rut.replace(/\./g, "").replace(/-/g, "").toUpperCase();

    // Separar número y dígito verificador
    const numero = rut.substring(0, rut.length - 1);
    const digitoVerificador = rut.charAt(rut.length - 1);

    // Calcular dígito verificador
    let suma = 0;
    let multiplicador = 2;

    for (let i = numero.length - 1; i >= 0; i--) {
      suma += parseInt(numero.charAt(i)) * multiplicador;
      multiplicador++;
      if (multiplicador > 7) multiplicador = 2;
    }

    const digito = 11 - (suma % 11);
    let dvCalculado;

    if (digito === 11) {
      dvCalculado = "0";
    } else if (digito === 10) {
      dvCalculado = "K";
    } else {
      dvCalculado = digito.toString();
    }

    return dvCalculado === digitoVerificador;
  }

  validarGenero() {
    const genero = document.getElementById("genero").value;

    if (!genero) {
      this.agregarError("genero", "Debes seleccionar un género");
    }
  }

  validarNacionalidad() {
    const nacionalidad = document.getElementById("nacionalidad").value;

    if (!nacionalidad) {
      this.agregarError("nacionalidad", "Debes seleccionar una nacionalidad");
    }
  }

  /**
   * VALIDACIONES DE CONTACTO Y ACCESO
   */
  validarContactoAcceso() {
    this.validarEmail();
    this.validarConfirmarEmail();
    this.validarContraseña();
    this.validarConfirmarContraseña();
    this.validarTelefono();
  }

  validarEmail() {
    const email = document.getElementById("email").value.trim();
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      this.agregarError("email", "El correo es requerido");
      this.marcarCampoError("email");
    } else if (!regexEmail.test(email)) {
      this.agregarError("email", "Formato de correo inválido");
      this.marcarCampoError("email");
    } else {
      this.marcarCampoOk("email");
    }
  }

  validarConfirmarEmail() {
    const email = document.getElementById("email").value.trim();
    const emailConfirm = document.getElementById("emailConfirm").value.trim();

    if (!emailConfirm) {
      this.agregarError("emailConfirm", "Debes confirmar el correo");
      this.marcarCampoError("emailConfirm");
    } else if (email !== emailConfirm) {
      this.agregarError("emailConfirm", "Los correos no coinciden");
      this.marcarCampoError("emailConfirm");
    } else {
      this.marcarCampoOk("emailConfirm");
    }
  }

  validarContraseña() {
    const password = document.getElementById("password").value;

    if (!password) {
      this.agregarError("password", "La contraseña es requerida");
      this.marcarCampoError("password");
    } else if (password.length < 8) {
      this.agregarError("password", "Mínimo 8 caracteres");
      this.marcarCampoError("password");
    } else if (!/[A-Z]/.test(password)) {
      this.agregarError("password", "Debe contener al menos 1 mayúscula");
      this.marcarCampoError("password");
    } else if (!/\d/.test(password)) {
      this.agregarError("password", "Debe contener al menos 1 número");
      this.marcarCampoError("password");
    } else if (!/[!@#$%^&*]/.test(password)) {
      this.agregarError(
        "password",
        "Debe contener al menos 1 carácter especial (!@#$%^&*)"
      );
      this.marcarCampoError("password");
    } else {
      this.marcarCampoOk("password");
    }
  }

  validarConfirmarContraseña() {
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("passwordConfirm").value;

    if (!passwordConfirm) {
      this.agregarError("passwordConfirm", "Debes confirmar la contraseña");
      this.marcarCampoError("passwordConfirm");
    } else if (password !== passwordConfirm) {
      this.agregarError("passwordConfirm", "Las contraseñas no coinciden");
      this.marcarCampoError("passwordConfirm");
    } else {
      this.marcarCampoOk("passwordConfirm");
    }
  }

  validarTelefono() {
    const telefono = document.getElementById("telefono").value.trim();
    const soloDigitos = telefono.replace(/\D/g, "");

    if (!telefono) {
      this.agregarError("telefono", "El teléfono es requerido");
      this.marcarCampoError("telefono");
    } else if (!/^[\d\s\-+]+$/.test(telefono)) {
      this.agregarError(
        "telefono",
        "Solo dígitos, espacios, + y - son permitidos"
      );
      this.marcarCampoError("telefono");
    } else if (soloDigitos.length < 8) {
      this.agregarError("telefono", "Mínimo 8 dígitos numéricos");
      this.marcarCampoError("telefono");
    } else {
      this.marcarCampoOk("telefono");
    }
  }

  /**
   * VALIDACIONES DE DIRECCIÓN
   */
  validarDireccion() {
    this.validarPaisEntrega();
    this.validarProvincia();
    this.validarCiudad();
    this.validarCalle();
    this.validarCodigoPostal();
    this.validarReferencia();
  }

  validarPaisEntrega() {
    const pais = document.getElementById("paisEntrega").value;

    if (!pais) {
      this.agregarError("paisEntrega", "Debes seleccionar un país");
      this.marcarCampoError("paisEntrega");
    } else {
      this.marcarCampoOk("paisEntrega");
    }
  }

  validarProvincia() {
    const provincia = document.getElementById("provincia").value.trim();

    if (!provincia) {
      this.agregarError("provincia", "La provincia es requerida");
      this.marcarCampoError("provincia");
    } else {
      this.marcarCampoOk("provincia");
    }
  }

  validarCiudad() {
    const ciudad = document.getElementById("ciudad").value.trim();
    const regexCiudad = /^[a-záéíóúñ\s]{2,}$/i;

    if (!ciudad) {
      this.agregarError("ciudad", "La ciudad es requerida");
      this.marcarCampoError("ciudad");
    } else if (!regexCiudad.test(ciudad)) {
      this.agregarError(
        "ciudad",
        "Solo letras y espacios, mínimo 2 caracteres"
      );
      this.marcarCampoError("ciudad");
    } else {
      this.marcarCampoOk("ciudad");
    }
  }

  validarCalle() {
    const calle = document.getElementById("calle").value.trim();

    if (!calle) {
      this.agregarError("calle", "La calle es requerida");
      this.marcarCampoError("calle");
    } else if (calle.length < 5) {
      this.agregarError("calle", "Mínimo 5 caracteres");
      this.marcarCampoError("calle");
    } else {
      this.marcarCampoOk("calle");
    }
  }

  validarCodigoPostal() {
    const codigoPostal = document.getElementById("codigoPostal").value.trim();
    const regexCodigoPostal = /^[a-zA-Z0-9]{4,10}$/;

    if (!codigoPostal) {
      this.agregarError("codigoPostal", "El código postal es requerido");
      this.marcarCampoError("codigoPostal");
    } else if (!regexCodigoPostal.test(codigoPostal)) {
      this.agregarError(
        "codigoPostal",
        "Solo alfanuméricos, 4-10 caracteres"
      );
      this.marcarCampoError("codigoPostal");
    } else {
      this.marcarCampoOk("codigoPostal");
    }
  }

  validarReferencia() {
    const referencia = document.getElementById("referencia").value;

    if (referencia.length > 200) {
      this.agregarError(
        "referencia",
        "Máximo 200 caracteres"
      );
    }
  }

  /**
   * VALIDACIONES DE PREFERENCIAS Y TÉRMINOS
   */
  validarPreferenciasTerminos() {
    this.validarCategorias();
    this.validarTipoCliente();
    this.validarComoNosConociste();
    this.validarTerminos();
    this.validarPrivacidad();
  }

  validarCategorias() {
    const categorias = document.querySelectorAll(
      'input[name="categorias"]:checked'
    );

    if (categorias.length === 0) {
      this.agregarError(
        "categorias",
        "Debes seleccionar al menos una categoría de interés"
      );
      this.marcarCampoError("categorias");
    } else {
      this.marcarCampoOk("categorias");
    }
  }

  validarTipoCliente() {
    const tipoCliente = document.querySelector(
      'input[name="tipoCliente"]:checked'
    );

    if (!tipoCliente) {
      this.agregarError("tipoCliente", "Debes seleccionar un tipo de cliente");
      this.marcarCampoError("tipoCliente");
    } else {
      this.marcarCampoOk("tipoCliente");
    }
  }

  validarComoNosConociste() {
    const comoNosConociste = document.getElementById("comoNosConociste").value;

    if (!comoNosConociste) {
      this.agregarError(
        "comoNosConociste",
        "Debes indicar cómo nos conociste"
      );
      this.marcarCampoError("comoNosConociste");
    } else {
      this.marcarCampoOk("comoNosConociste");
    }
  }

  validarTerminos() {
    const terminos = document.querySelector('input[name="terminos"]');

    if (!terminos.checked) {
      this.agregarError(
        "terminos",
        "Debes aceptar los Términos y Condiciones"
      );
      this.marcarCampoError("terminos");
    } else {
      this.marcarCampoOk("terminos");
    }
  }

  validarPrivacidad() {
    const privacidad = document.querySelector('input[name="privacidad"]');

    if (!privacidad.checked) {
      this.agregarError("privacidad", "Debes aceptar la Política de Privacidad");
      this.marcarCampoError("privacidad");
    } else {
      this.marcarCampoOk("privacidad");
    }
  }

  /**
   * Agregar error a la lista
   */
  agregarError(fieldId, mensaje) {
    if (!this.errores[fieldId]) {
      this.errores[fieldId] = [];
    }
    this.errores[fieldId].push(mensaje);
  }

  /**
   * Marcar campo como error
   */
  marcarCampoError(fieldId) {
    const field = document.getElementById(fieldId);
    if (field) {
      const formGroup = field.closest(".form-group") || field.closest(".form-group-block");
      if (formGroup) {
        formGroup.classList.remove("campo-ok");
        formGroup.classList.add("campo-error");
      }
    }
  }

  /**
   * Marcar campo como válido
   */
  marcarCampoOk(fieldId) {
    const field = document.getElementById(fieldId);
    if (field) {
      const formGroup = field.closest(".form-group") || field.closest(".form-group-block");
      if (formGroup) {
        formGroup.classList.remove("campo-error");
        formGroup.classList.add("campo-ok");
      }
    }
  }

  /**
   * Limpiar clases de validación
   */
  limpiarClaseCampo(fieldId) {
    const field = document.getElementById(fieldId);
    if (field) {
      const formGroup = field.closest(".form-group") || field.closest(".form-group-block");
      if (formGroup) {
        formGroup.classList.remove("campo-error", "campo-ok");
      }
    }
  }

  /**
   * Mostrar errores en la UI
   */
  mostrarErrores() {
    // Limpiar errores previos
    this.limpiarErroresUI();

    // Contar errores totales
    const totalErrores = Object.keys(this.errores).length;

    // Crear contenedor de errores globales
    const errorContainer = document.createElement("div");
    errorContainer.className = "error-container visible";
    errorContainer.innerHTML = `
      <div class="error-message">
        <strong>⚠️ Se encontraron ${totalErrores} campo(s) con error:</strong>
        <ul>
          ${Object.entries(this.errores)
            .flatMap(([, mensajes]) =>
              mensajes.map((msg) => `<li>${msg}</li>`)
            )
            .join("")}
        </ul>
      </div>
    `;

    // Insertar al inicio del formulario
    this.form.insertBefore(errorContainer, this.form.firstChild);

    // Marcar campos con error
    Object.keys(this.errores).forEach((fieldId) => {
      const field = document.getElementById(fieldId);
      if (field) {
        const formGroup = field.closest(".form-group") || field.closest(".form-group-block");
        if (formGroup) {
          formGroup.classList.add("error");

          // Agregar icono de error
          if (!formGroup.querySelector(".error-icon")) {
            const errorIcon = document.createElement("span");
            errorIcon.className = "error-icon";
            errorIcon.textContent = "⚠️";
            if (field.type === "checkbox" || field.type === "radio") {
              formGroup.appendChild(errorIcon);
            } else {
              field.parentNode.insertBefore(errorIcon, field.nextSibling);
            }
          }

          // Agregar mensaje de error debajo del campo
          if (!formGroup.querySelector(".error-text")) {
            const errorText = document.createElement("span");
            errorText.className = "error-text";
            errorText.textContent = this.errores[fieldId][0];
            formGroup.appendChild(errorText);
          }
        }
      }
    });

    // Scroll al primer error
    const primerCampoConError = Object.keys(this.errores)[0];
    if (primerCampoConError) {
      const campo = document.getElementById(primerCampoConError);
      if (campo) {
        campo.focus();
        campo.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }

    // Scroll al contenedor de errores
    setTimeout(() => {
      errorContainer.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  /**
   * Limpiar errores de la UI
   */
  limpiarErroresUI() {
    // Remover contenedor de errores
    const errorContainer = this.form.querySelector(".error-container");
    if (errorContainer) {
      errorContainer.remove();
    }

    // Remover mensajes de error individuales
    const errorTexts = this.form.querySelectorAll(".error-text");
    errorTexts.forEach((errorText) => {
      errorText.remove();
    });
  }

  /**
   * Mostrar mensaje de éxito
   */
  mostrarMensajeExito() {
    const nombre = document.getElementById("nombre").value.trim();
    
    // Crear overlay/modal de éxito
    const successOverlay = document.createElement("div");
    successOverlay.className = "success-overlay";
    successOverlay.innerHTML = `
      <div class="success-modal">
        <div class="success-icon">✓</div>
        <h2>¡Registro Exitoso!</h2>
        <p class="success-nombre">Bienvenido/a, <strong>${nombre}</strong></p>
        <p class="success-text">Tu cuenta ha sido creada correctamente. Ya puedes acceder a todos nuestros servicios.</p>
        <a href="index.html" class="btn btn-primary success-btn">Volver al Inicio</a>
      </div>
    `;
    
    document.body.appendChild(successOverlay);
    
    // Ocultar formulario
    this.form.style.display = "none";
    
    // Scroll a la parte superior
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /**
   * Agregar escuchadores para validación al salir del campo (blur)
   */
  agregarEscuchadoresBlur() {
    const camposConValidacion = [
      "nombre",
      "fechaNacimiento",
      "rut",
      "genero",
      "nacionalidad",
      "email",
      "emailConfirm",
      "password",
      "passwordConfirm",
      "telefono",
      "paisEntrega",
      "provincia",
      "ciudad",
      "calle",
      "codigoPostal",
      "comoNosConociste",
    ];

    camposConValidacion.forEach((fieldId) => {
      const field = document.getElementById(fieldId);
      if (field) {
        field.addEventListener("blur", () => {
          const metodoNombre =
            "validar" + fieldId.charAt(0).toUpperCase() + fieldId.slice(1);
          if (typeof this[metodoNombre] === "function") {
            this[metodoNombre]();
          }
        });
      }
    });
  }

  /**
   * Agregar escuchadores para limpiar errores cuando el usuario escribe
   */
  agregarEscuchadoresInput() {
    const campos = this.form.querySelectorAll("input, select, textarea");

    campos.forEach((campo) => {
      campo.addEventListener("input", () => {
        const formGroup = campo.closest(".form-group") || campo.closest(".form-group-block");
        if (formGroup && formGroup.classList.contains("campo-error")) {
          formGroup.classList.remove("campo-error");
          const errorText = formGroup.querySelector(".error-text");
          if (errorText) {
            errorText.remove();
          }
          
          const errorContainer = this.form.querySelector(".error-container");
          if (errorContainer) {
            const remainingErrors = this.form.querySelectorAll(".campo-error").length;
            if (remainingErrors === 0) {
              errorContainer.style.opacity = "0.5";
            }
          }
        }
      });

      campo.addEventListener("change", () => {
        const formGroup = campo.closest(".form-group") || campo.closest(".form-group-block");
        if (formGroup && formGroup.classList.contains("campo-error")) {
          formGroup.classList.remove("campo-error");
          const errorText = formGroup.querySelector(".error-text");
          if (errorText) {
            errorText.remove();
          }
        }
      });
    });

    const referencia = document.getElementById("referencia");
    if (referencia) {
      referencia.addEventListener("input", () => {
        const charCount = document.getElementById("charCount");
        if (charCount) {
          charCount.textContent = `${referencia.value.length}/200`;
        }
      });
    }
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", function () {
  new FormValidator("registroForm");
});
