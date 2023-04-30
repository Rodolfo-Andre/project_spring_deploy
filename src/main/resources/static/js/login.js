import useFetch from "./fetch.js";
import { showModal, insertContentModal } from "./modal.js";

const $d = document;

$d.addEventListener("DOMContentLoaded", () => {
  console.log("Una vez cargado el contenido del DOM se ejecuta este console");

  handleOnClick();
});

const handleOnClick = () => {
  const $btnRecoverPassword = $d.querySelector(".recover-password"),
    $btnLogin = $d.getElementById("validate-login");

  const $inputEmail = $d.getElementById("email"),
    $inputPassword = $d.getElementById("password");

  $d.addEventListener("click", (e) => {
    let $btnVerifyEmail = $d.querySelector("[data-send]"),
      $btnSendCode = $d.querySelector("[data-send-code]"),
      $btnVerifyCode = $d.querySelector("[data-verify-code]"),
      $btnChangePasssword = $d.querySelector("[data-change-password]");

    if ($btnRecoverPassword == e.target) {
      let contentModal = {
        header: `<button data-bs-dismiss="modal" aria-label="Close"><i class="bi bi-x-circle-fill"></i></button>
				        <h4 class="modal-title" id="recover-password-label">¿Olvidó su contraseña? Sigue estas indicaciones:</h4>`,
        body: `<p>
				        Ingrese la dirección de su correo electrónico con la que está registrada su cuenta.<br/>
		Le enviaremos a su correo un código de confirmación a la que deberá de ingresar en el formulario para que puedas restablecer su contraseña.
				        </p>
				        
				        <div>
				         	<input class="form-control form-control-lg" type="text" id="email-verify" name="emailVerify" placeholder="Email*">
				        	<div id="email-verify-invalid" class="text-start invalid-feedback"></div>	
				        </div>`,
        footer: `<button data-send class="w-100 btn btn-primary btn-lg">ENVIAR</button>`,
      };

      showModal(contentModal, "recover-password");
    }

    if ($btnLogin == e.target) {
      let $errorLogin = $d.querySelector(".login-error"),
        $emailInvalid = $d.getElementById("email-invalid"),
        $passwordInvalid = $d.getElementById("password-invalid");

      let isInvalid = false;

      if ($errorLogin) $errorLogin.outerHTML = "";

      if (
        !$inputEmail.value.match(
          /^[A-Za-z0-9._]+@[a-z]{4,8}(\.[a-z]{2,4}){1,2}$/
        )
      ) {
        if (!$inputEmail.classList.contains("is-invalid"))
          $inputEmail.classList.add("is-invalid");
        $emailInvalid.textContent = "Ingrese un correo válido";
        isInvalid = true;
      } else {
        if ($inputEmail.classList.contains("is-invalid"))
          $inputEmail.classList.remove("is-invalid");
      }

      if (!$inputPassword.value || $inputPassword.value.match(/^\s*$/)) {
        if (!$inputPassword.classList.contains("is-invalid"))
          $inputPassword.classList.add("is-invalid");
        $passwordInvalid.textContent = "Ingrese una contraseña correcta";
        isInvalid = true;
      } else {
        if ($inputPassword.classList.contains("is-invalid"))
          $inputPassword.classList.remove("is-invalid");
      }

      if (isInvalid) {
        e.preventDefault();
      }
    }

    if ($btnVerifyEmail == e.target) {
      let $inputVerifyEmail = $d.getElementById("email-verify"),
        $verifyEmailInvalid = $d.getElementById("email-verify-invalid");

      if (
        !$inputVerifyEmail.value.match(
          /^[A-Za-z0-9._]+@[a-z]{4,8}(\.[a-z]{2,4}){1,2}$/
        )
      ) {
        if (!$inputVerifyEmail.classList.contains("is-invalid"))
          $inputVerifyEmail.classList.add("is-invalid");
        $verifyEmailInvalid.textContent = "Ingrese un correo válido";
        return;
      }

      let params = {
        type: "verifyEmail",
        email: $inputVerifyEmail.value,
      };

      let props = {
        url: "login?" + new URLSearchParams(params),
        success: async (json) => {
          let { isCorrect } = await json;

          if (isCorrect) {
            let contentModal = {
              header: `<button data-bs-dismiss="modal" aria-label="Close"><i class="bi bi-x-circle-fill"></i></button>
							         <h4 class="modal-title" id="recover-password-label">El código de verificación ha sido enviado a su correo:</h4>`,
              body: `<p >Ingrese el código de verificación, en caso de que no lo haya recibido, presiona  
										<span id="content-code"><a class="fw-bold" data-send-code>volver a enviar</a><span>.
									</p>
									
									<div>
										<input class="form-control form-control-lg" type="text" id="code-verify" name="code" placeholder="Código de Seguridad*">
										<div id="code-invalid" class="text-start invalid-feedback"></div>	
									</div>`,
              footer: `<button data-verify-code class="w-100 btn btn-primary btn-lg">VERIFICAR</button>`,
            };

            insertContentModal(contentModal, "recover-password");
          } else {
            if (!$inputVerifyEmail.classList.contains("is-invalid"))
              $inputVerifyEmail.classList.add("is-invalid");
            $emailInvalid.textContent =
              "El correo no está asociado a ninguna cuenta";
          }
        },
        options: {
          method: "POST",
        },
      };

      useFetch(props);
    }

    if ($btnVerifyCode == e.target) {
      let $inputVerifyCode = $d.getElementById("code-verify"),
        $codeInvalid = $d.getElementById("code-invalid");

      if (!$inputVerifyCode.value.match(/^[0-9]+$/)) {
        if (!$inputVerifyCode.classList.contains("is-invalid"))
          $inputVerifyCode.classList.add("is-invalid");
        $codeInvalid.textContent =
          "Introduce el código correctamente. Solo se acepta dígitos";
        return;
      }

      let params = {
        type: "verifyCode",
        code: $inputVerifyCode.value,
      };

      let props = {
        url: "login?" + new URLSearchParams(params),
        success: async (json) => {
          let { isCorrect } = await json;

          if (isCorrect) {
            let contentModal = {
              header: `<button data-bs-dismiss="modal" aria-label="Close"><i class="bi bi-x-circle-fill"></i></button>
							         <h4 class="modal-title" id="recover-password-label">Restablezca su contraseña:</h4>`,
              body: `<p>Ahora ingrese la nueva constraseña:</p>
							
									<form class="d-flex flex-column gap-3">
										<div>
											<input class="form-control form-control-lg" type="password" id="new-password" name="newPassword" autocomplete="new-password" placeholder="Password*">
											<div id="new-password-invalid" class="text-start invalid-feedback">La contraseña no cumple con la regla de contraseña segura</div>		
										</div>
										
										<div>
											<input class="form-control form-control-lg" type="password" id="new-confirm-password" name="newConfirmPassword" autocomplete="new-password" placeholder="Confirmar Password*">
											<div id="new-confirm-password-invalid" class="text-start invalid-feedback">Confirmar contraseña es inválida</div>
										</div>
									</form>`,
              footer: `<button data-change-password class="w-100 btn btn-primary btn-lg">CAMBIAR CONTRASEÑA</button>`,
            };

            insertContentModal(contentModal, "recover-password");
          } else {
            if (!$inputVerifyCode.classList.contains("is-invalid"))
              $inputVerifyCode.classList.add("is-invalid");
            $codeInvalid.textContent = "Código inválido";
          }
        },
        options: {
          method: "POST",
        },
      };

      useFetch(props);
    }

    if ($btnSendCode == e.target) {
      let $contentCode = $d.getElementById("content-code");

      let params = {
        type: "sendCode",
      };

      let props = {
        url: "login?" + new URLSearchParams(params),
        success: async () => {
          let seconds = 120;

          const myInterval = setInterval(() => {
            if (!seconds) {
              $contentCode.innerHTML = `<span id="content-code"><a class="fw-bold" data-send-code>volver a enviar</a><span>.`;
              clearInterval(myInterval);
              return;
            }

            $contentCode.innerHTML = `<strong>${seconds} segundos para volver a enviar.</strong>`;

            seconds--;
          }, 1000);
        },
        options: {
          method: "POST",
        },
      };

      useFetch(props);
    }

    if ($btnChangePasssword == e.target) {
      let $inputNewPassword = $d.getElementById("new-password"),
        $inputNewConfirmPassword = $d.getElementById("new-confirm-password");

      let isInvalid = false;

      if (
        !$inputNewPassword.value.match(
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[$@$!%*?&])([A-Za-z\\d$@$!%*?&]|[^ ]){7,25}$"
        )
      ) {
        if (!$inputNewPassword.classList.contains("is-invalid"))
          $inputNewPassword.classList.add("is-invalid");
        alert(
          `La contraseña debe tener: \n-Mínimo 7 caracteres\n-Máximo 25\n-Al menos una letra mayúscula\n-Al menos una letra minúscula\n-Al menos un dígito\n-No espacios en blanco\n-Al menos 1 caracter especial`
        );
        isInvalid = true;
      } else {
        if ($inputNewPassword.classList.contains("is-invalid"))
          $inputNewPassword.classList.remove("is-invalid");
      }

      if (
        !$inputNewConfirmPassword.value.match(
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[$@$!%*?&])([A-Za-z\\d$@$!%*?&]|[^ ]){7,15}$"
        ) ||
        $inputNewPassword.value != $inputNewConfirmPassword.value
      ) {
        if (!$inputNewConfirmPassword.classList.contains("is-invalid"))
          $inputNewConfirmPassword.classList.add("is-invalid");
        isInvalid = true;
      } else {
        if ($inputNewConfirmPassword.classList.contains("is-invalid"))
          $inputNewConfirmPassword.classList.remove("is-invalid");
      }

      if (isInvalid) return;

      let params = {
        type: "changePassword",
        password: $inputNewPassword.value,
      };

      let props = {
        url: "login?" + new URLSearchParams(params),
        success: async (json) => {
          let { isCorrect } = await json;

          if (isCorrect) {
            let $modalBS = bootstrap.Modal.getInstance(
              $d.getElementById("recover-password")
            );
            $modalBS._config.backdrop = true;
            $modalBS._config.keyboard = true;

            let contentModal = {
              header: `<i class="icon text-success text-center bi-check-circle-fill"></i>`,
              body: `<p class="text-center">Cambios realizados exitosamente</p>`,
            };

            insertContentModal(contentModal, "recover-password");

            setTimeout(() => {
              $modalBS.hide();
            }, 2000);
          } else {
            if (!$inputNewConfirmPassword.classList.contains("is-invalid"))
              $inputNewConfirmPassword.classList.add("is-invalid");
            $newConfirmPasswordInvalid = "Introduzca una nueva contraseña";
          }
        },
        options: {
          method: "POST",
        },
      };

      useFetch(props);
    }
  });
};
