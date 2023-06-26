import { showModal } from "./modal.js";

const $d = document;

$d.addEventListener("DOMContentLoaded", () => {
  initializeTable();
  addEventToTable();
  addEventToButtonAdd();
  addEventToButtonConfirmAddAndConfirmUpdate();
});

const initializeTable = () => {
  const table = $("#tablaEmpleado").DataTable({
    language: {
      url: "/language/datatables-es-mx.json",
    },
    responsive: true,
    fixedHeader: true,
    rowId: "0",
    columns: [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      { orderable: false, searchable: false, width: 50 },
      { orderable: false, searchable: false, width: 50 },
      { orderable: false, searchable: false, width: 50 },
    ],
    initComplete: function () {
      $("#tablaEmpleado thead tr th").each(function (i) {
        const title = $(this).text();

        if (!["Información", "Modificar", "Eliminar"].includes(title)) {
          $(this).html(
            `
            <div class="d-flex gap-3 flex-column align-items-start">
              <label>${title}</label>
              <input type="seacrh" placeholder="Buscar..." class="form-control form-control-sm w-auto"/>
            </div>
           `
          );

          $("input", this)
            .on("click", function (e) {
              e.stopPropagation();
            })
            .on("keyup change", function (e) {
              if (table.column(i).search() !== this.value) {
                table.column(i).search(this.value).draw();
              }
            });
        }
      });
    },
  });
};

const addEventToTable = () => {
  $("#tablaEmpleado tbody").on(
    "click",
    "td .icon-info, td .icon-update, td .icon-delete",
    function (e) {
      let id;

      const $listBtnInfo = $(".icon-info"),
        $listBtnUpdate = $(".icon-update"),
        $listBtnDelete = $(".icon-delete");

      if ($(this).parents("tr").hasClass("child")) {
        id = $(this).parents("tr").prev().find("td:eq(0)").text();
      } else {
        id = $(this).closest("tr").find("td:eq(0)").text();
      }

      if ($listBtnInfo.filter(e.currentTarget).length) {
        $.get(`/configuracion/empleado/obtener/${id}`, (data) => {
          const fechaRegistro = new Date(data.fechaRegistro);
          const formattedFechaRegistro = `${fechaRegistro.getFullYear()}-${
            fechaRegistro.getMonth() + 1
          }-${fechaRegistro.getDate()}`;

          if (data) {
            const contentModal = {
              header: `<i class="icon text-center text-link bi bi-info-circle-fill"></i>
										 <h4 class="modal-title text-center" id="modal-prototype-label">Empleado - ${data.id}</h4>`,
              body: `<div class="text-center">
											<div><strong>Nombre del empleado: </strong>${data.nombre}</div>
                      <div><strong>Apellido del empleado: </strong>${
                        data.apellido
                      }</div>
                      <div><strong>Telefono del empleado: </strong>${
                        data.telefono
                      }</div>
                      <div><strong>Dni del empleado: </strong>${data.dni}</div>
                      <div><strong>Fecha de registro del empleado: </strong>${formattedFechaRegistro}</div>
                      <div style="text-transform: capitalize"><strong>Cargo del empleado: </strong>${data.cargo.nombre
                        .replace("ROLE_", "")
                        .toLowerCase()}</div>
                      <div><strong>Correo del empleado: </strong>${
                        data.usuario.correo
                      }</div>
										</div>`,
              footer: `<button data-bs-dismiss="modal" aria-label="Close" class="w-100 btn btn-primary">CERRAR</button>`,
            };

            showModal(contentModal);
          }
        });
      }

      if ($listBtnUpdate.filter(e.currentTarget).length) {
        $.get(`/configuracion/cargo/obtener`, (dataCargo) => {
          $.get(`/configuracion/empleado/obtener/${id}`, (data) => {
            const listOptions = dataCargo.map(
              (cargo) =>
                `<option value="${
                  cargo.id
                }" style="text-transform: capitalize" ${
                  cargo.id == data.cargo.id ? "selected" : ""
                }>${cargo.nombre.replace("ROLE_", "").toLowerCase()}</option>`
            );
            const options = listOptions.join(" ");

            $.get(`/usuario`, (user) => {
              const disable = user.id == id;

              if (data) {
                const contentModal = {
                  header: `<i class="icon text-center text-warning bi bi-pencil-square"></i>
						          <h4 class="modal-title text-center" id="modal-prototype-label">Actualizar Empleado - ${data.id}</h4>`,
                  body: `<form class="d-flex flex-column gap-4" id="form-update" action="/configuracion/empleado/actualizar" method="POST">		
                    <input type="hidden"  id="codEmployed" name="id" value="${
                      data.id
                    }"/>
							
                    <div class="row align-items-sm-center">
                      <label class="col-sm-5 fw-bold" for="name">Nombre:</label>
                      <div class="col-sm-7">
                        <input class="form-control" type="text" id="name" name="nameEmpleado" value="${
                          data.nombre
                        }"/>
                        <div id="name-invalid" class="text-start invalid-feedback">Ingresa un nombre válido. Debe tener entre 3 y 40 caracteres, comenzar con una letra mayúscula seguida de letras minúsculas. Puedes utilizar espacios entre las palabras, pero la primera letra de cada palabra adicional también debe ser una letra mayúscula seguida de letras minúsculas.</div>
                      </div>
                    </div>

                    <div class="row align-items-sm-center">
                      <label class="col-sm-5 fw-bold" for="name">Apellido:</label>
                      <div class="col-sm-7">
                        <input class="form-control" type="text" id="apellido" name="lastnameEmpleado" value="${
                          data.apellido
                        }"/>
                        <div id="name-invalid" class="text-start invalid-feedback">Ingresa un apellido válido. Debe tener entre 3 y 40 caracteres, comenzar con una letra mayúscula seguida de letras minúsculas. Puedes utilizar espacios entre las palabras, pero la primera letra de cada palabra adicional también debe ser una letra mayúscula seguida de letras minúsculas.</div>
                      </div>
                    </div>

                    <div class="row align-items-sm-center">
                      <label class="col-sm-5 fw-bold" for="name">DNI:</label>
                      <div class="col-sm-7">
                        <input class="form-control" type="text" id="dni" name="dni" value="${
                          data.dni
                        }"/>
                        <div id="dni-invalid" class="text-start invalid-feedback">Ingresa un número de teléfono válido. Debe comenzar con el dígito 9, seguido de otros 8 dígitos numéricos.</div>
                      </div>
                    </div>

                    <div class="row align-items-sm-center">
                      <label class="col-sm-5 fw-bold" for="name">Correo:</label>
                      <div class="col-sm-7">
                        <input class="form-control" type="text" id="correo" name="correo" value="${
                          data.usuario.correo
                        }" ${disable ? "disabled" : ""}/>
                        <div id="correo-invalid" class="text-start invalid-feedback">Ingresa un correo válido.</div>
                      </div>
                    </div>

                    <div class="row align-items-sm-center">
                      <label class="col-sm-5 fw-bold" for="name">Telefono:</label>
                      <div class="col-sm-7">
                        <input class="form-control" type="text" id="telefono" name="telefono" value="${
                          data.telefono
                        }"/>
                        <div id="telefono-invalid" class="text-start invalid-feedback">Ingresa la categoría de plato correctamente. Mínimo 3 caracteres, máximo 20.</div>
                      </div>
                    </div>

                    <div class="row align-items-sm-center">
                      <label class="col-sm-5 fw-bold">Cargo:</label>
                      <div class="col-sm-7">
                        <select class="form-select" name="cargo" style="text-transform: capitalize" ${
                          disable ? "disabled" : ""
                        }>
                          ${options}
                        </select>
                      </div>
                    </div>

                  </form>`,
                  footer: `<input id="update" form="form-update" type="submit" class="w-50 text-white btn btn-warning" value="MODIFICAR"/>
										<button id="btn-cancel" data-bs-dismiss="modal" aria-label="Close" class="w-50 btn btn-danger">CANCELAR</button>`,
                };

                showModal(contentModal);
              }
            });
          });
        });
      }

      if ($listBtnDelete.filter(e.currentTarget).length) {
        const contentModal = {
          header: `<i class="icon text-center text-danger bi bi-trash-fill"></i>
						<h4 class="modal-title text-center" id="modal-prototype-label">¿ESTÁS SEGURO DE ELIMINAR EL EMPLEADO? - ${id}?</h4>`,
          body: `<form id="form-delete" action="/configuracion/empleado/eliminar" method="POST">
							<input type="hidden" name="id" value="${id}"/>
						</form>`,
          footer: `<input form="form-delete" type="submit" class="w-50 text-white btn btn-danger" value="ELIMINAR"/>
						<button id="btn-cancel" data-bs-dismiss="modal" aria-label="Close" class="w-50 btn btn-primary">CANCELAR</button>`,
        };

        showModal(contentModal);
      }
    }
  );
};

const addEventToButtonAdd = () => {
  $("#btn-add").on("click", () => {
    $.get(`/configuracion/cargo/obtener`, (data) => {
      const listOptions = data.map(
          (cargo) =>
            `<option value="${
              cargo.id
            }" style="text-transform: capitalize">${cargo.nombre
              .replace("ROLE_", "")
              .toLowerCase()}</option>`
        ),
        $options = listOptions.join(" ");
      console.log($options);

      const contentModal = {
        header: `<i class="icon text-center text-primary bi bi-plus-circle-fill"></i>
						<h4 class="modal-title text-center" id="modal-prototype-label">Nuevo Empleado</h4>`,
        body: `<form class="d-flex flex-column gap-4" id="form-add" action="/configuracion/empleado/registrar" method="POST">		
							
                <div class="row align-items-sm-center">
								<label class="col-sm-5 fw-bold" for="name">Nombre:</label>
								<div class="col-sm-7">
									<input class="form-control" type="text" id="name" name="nameEmpleado" value=""/>
									<div id="name-invalid" class="text-start invalid-feedback">Ingresa un nombre válido. Debe tener entre 3 y 40 caracteres, comenzar con una letra mayúscula seguida de letras minúsculas. Puedes utilizar espacios entre las palabras, pero la primera letra de cada palabra adicional también debe ser una letra mayúscula seguida de letras minúsculas.</div>
								</div>
                </div>

                <div class="row align-items-sm-center">
								<label class="col-sm-5 fw-bold" for="name">Apellido:</label>
								<div class="col-sm-7">
									<input class="form-control" type="text" id="apellido" name="lastnameEmpleado" value=""/>
									<div id="apellido-invalid" class="text-start invalid-feedback">Ingresa un apellido válido. Debe tener entre 3 y 40 caracteres, comenzar con una letra mayúscula seguida de letras minúsculas. Puedes utilizar espacios entre las palabras, pero la primera letra de cada palabra adicional también debe ser una letra mayúscula seguida de letras minúsculas.</div>
								</div>
                </div>

                <div class="row align-items-sm-center">
								<label class="col-sm-5 fw-bold" for="name">DNI:</label>
								<div class="col-sm-7">
									<input class="form-control" type="text" id="dni" name="dni" value=""/>
									<div id="dni-invalid" class="text-start invalid-feedback">Ingresa un número de teléfono válido. Debe comenzar con el dígito 9, seguido de otros 8 dígitos numéricos.</div>
								</div>
                </div>

                <div class="row align-items-sm-center">
								<label class="col-sm-5 fw-bold" for="name">Correo:</label>
								<div class="col-sm-7">
									<input class="form-control" type="text" id="correo" name="correo" value=""/>
									<div id="correo-invalid" class="text-start invalid-feedback">Ingresa un correo válido.</div>
								</div>
                </div>

                <div class="row align-items-sm-center">
								<label class="col-sm-5 fw-bold" for="name">Telefono:</label>
								<div class="col-sm-7">
									<input class="form-control" type="text" id="telefono" name="telefono" value=""/>
									<div id="telefono-invalid" class="text-start invalid-feedback">Ingresa la categoría de plato correctamente. Mínimo 3 caracteres, máximo 20.</div>
								</div>
                </div>

								<div class="row align-items-sm-center">
										<label class="col-sm-5 fw-bold">Cargo:</label>
											<div class="col-sm-7">
												<select class="form-select" name="cargo" style="text-transform: capitalize">
													${$options}
												</select>
										</div>
									</div>

							
						</form>`,
        footer: `<input id="add" form="form-add" type="submit" class="w-50 btn btn-primary" value="AÑADIR"/>
						<button id="btn-cancel" data-bs-dismiss="modal" aria-label="Close" class="w-50 btn btn-danger">CANCELAR</button>`,
      };

      showModal(contentModal);
    });
  });
};

const addEventToButtonConfirmAddAndConfirmUpdate = () => {
  $($d).on("click", "#add, #update", async (e) => {
    e.preventDefault();

    const $btnConfirmAdd = $("#add")[0],
      $btnConfirmUpdate = $("#update")[0],
      $form = $(e.target.form);

    let isInvalid = false;

    if ($btnConfirmAdd == e.target || $btnConfirmUpdate == e.target) {
      const $inputName = $d.getElementById("name"),
        $inputApellido = $d.getElementById("apellido"),
        $inputCorreo = $d.getElementById("correo"),
        $inputTelefono = $d.getElementById("telefono"),
        $divEmailInvalid = $d.getElementById("correo-invalid"),
        $divTelephoneInvalid = $d.getElementById("telefono-invalid"),
        $inputDni = $d.getElementById("dni"),
        $divDniInvalid = $d.getElementById("dni-invalid");

      $inputName.value = $inputName.value.trim();
      $inputApellido.value = $inputApellido.value.trim();
      $inputCorreo.value = $inputCorreo.value.trim();
      $inputTelefono.value = $inputTelefono.value.trim();
      $inputDni.value = $inputDni.value.trim();

      if (
        !$inputName.value.match(
          "^(?=.{3,40}$)[A-ZÑÁÉÍÓÚ][a-zñáéíóú]+(?: [A-ZÑÁÉÍÓÚ][a-zñáéíóú]+)*$"
        )
      ) {
        if (!$inputName.classList.contains("is-invalid"))
          $inputName.classList.add("is-invalid");
        isInvalid = true;
      } else {
        if ($inputName.classList.contains("is-invalid"))
          $inputName.classList.remove("is-invalid");
      }

      if (
        !$inputApellido.value.match(
          "^(?=.{3,40}$)[A-ZÑÁÉÍÓÚ][a-zñáéíóú]+(?: [A-ZÑÁÉÍÓÚ][a-zñáéíóú]+)*$"
        )
      ) {
        if (!$inputApellido.classList.contains("is-invalid"))
          $inputApellido.classList.add("is-invalid");
        isInvalid = true;
      } else {
        if ($inputApellido.classList.contains("is-invalid"))
          $inputApellido.classList.remove("is-invalid");
      }

      if (
        !$inputCorreo.value.match(
          "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"
        )
      ) {
        if ($divEmailInvalid.textContent != "Ingresa un correo válido.") {
          $divEmailInvalid.textContent = "Ingresa un correo válido.";
        }

        if (!$inputCorreo.classList.contains("is-invalid")) {
          $inputCorreo.classList.add("is-invalid");
        }

        isInvalid = true;
      } else {
        let codemployed = 0;
        let url = `/configuracion/empleado/verificar-correo/${$inputCorreo.value}`;

        if ($btnConfirmUpdate) {
          codemployed = $d.getElementById("codEmployed").value;
          url += `/${codemployed}`;
        }

        const data = await $.get(url);

        if (data.isFound) {
          $divEmailInvalid.textContent = `No se permiten Correo duplicados. Se encontró un registro con el Correo: ${$inputCorreo.value}. Ingresa un nuevo Correo.`;
          if (!$inputCorreo.classList.contains("is-invalid")) {
            $inputCorreo.classList.add("is-invalid");
          }
          isInvalid = true;
        } else {
          if ($inputCorreo.classList.contains("is-invalid")) {
            $inputCorreo.classList.remove("is-invalid");
          }
        }
      }

      if (!$inputTelefono.value.match("^9[0-9]{8}$")) {
        if (
          $divTelephoneInvalid.textContent !=
          "Ingresa un número de teléfono válido. Debe comenzar con el dígito 9, seguido de otros 8 dígitos numéricos."
        ) {
          $divTelephoneInvalid.textContent =
            "Ingresa un número de teléfono válido. Debe comenzar con el dígito 9, seguido de otros 8 dígitos numéricos.";
        }

        if (!$inputTelefono.classList.contains("is-invalid")) {
          $inputTelefono.classList.add("is-invalid");
        }
        isInvalid = true;
      } else {
        let codemployed = 0;
        let url = `/configuracion/empleado/verificar-telefono/${$inputTelefono.value}`;

        if ($btnConfirmUpdate) {
          codemployed = $d.getElementById("codEmployed").value;
          url += `/${codemployed}`;
        }

        const data = await $.get(url);

        if (data.isFound) {
          $divTelephoneInvalid.textContent = `No se permiten Télefonos duplicados. Se encontró un registro con el Teléfono: ${$inputTelefono.value}. Ingresa un nuevo Telefono.`;
          if (!$inputTelefono.classList.contains("is-invalid")) {
            $inputTelefono.classList.add("is-invalid");
          }
          isInvalid = true;
        } else {
          if ($inputTelefono.classList.contains("is-invalid")) {
            $inputTelefono.classList.remove("is-invalid");
          }
        }
      }

      if (!$inputDni.value.match("^[0-9]{8}$")) {
        if (
          $divDniInvalid.textContent !=
          "Ingresa un dni válido que contenga 8 dígitos."
        ) {
          $divDniInvalid.textContent =
            "Ingresa un dni válido que contenga 8 dígitos.";
        }
        if (!$inputDni.classList.contains("is-invalid")) {
          $inputDni.classList.add("is-invalid");
        }
        isInvalid = true;
      } else {
        let codemployed = 0;
        let url = `/configuracion/empleado/verificar-dni/${$inputDni.value}`;

        if ($btnConfirmUpdate) {
          codemployed = $d.getElementById("codEmployed").value;
          url += `/${codemployed}`;
        }

        const data = await $.get(url);

        if (data.isFound) {
          console.log(data.isFound);
          $divDniInvalid.textContent = `No se permiten DNI duplicados. Se encontró un registro con el DNI: ${$inputDni.value}. Ingresa un nuevo DNI.`;
          if (!$inputDni.classList.contains("is-invalid")) {
            $inputDni.classList.add("is-invalid");
          }
          isInvalid = true;
        } else {
          if ($inputDni.classList.contains("is-invalid")) {
            $inputDni.classList.remove("is-invalid");
          }
        }
      }
    }

    if (!isInvalid) {
      const $loader = $(`<div class="flex-grow-1 text-center">
                        <div class="spinner-border text-primary" role="status">
                          <span class="visually-hidden">Loading...</span>
                        </div>
                        </div>`);

      $(e.target).replaceWith($loader);
      $("#btn-cancel").prop("disabled", true);

      $form.submit();
    }
  });
};
