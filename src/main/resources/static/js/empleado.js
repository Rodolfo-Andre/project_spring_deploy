
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
        // Código para el botón "info"
      }

      if ($listBtnUpdate.filter(e.currentTarget).length) {
        $.get(`/configuracion/cargo/obtener`, (data) => {
          const listOptions = data.map(
            (cargo) =>
              `<option value="${cargo.id}" style="text-transform: capitalize">${cargo.nombre.replace(
                "ROLE_",
                ""
              ).toLowerCase()}</option>`
          );
          const options = listOptions.join(" ");

          $.get(`/configuracion/empleado/obtener/${id}`, (data) => {
            if (data) {
              const contentModal = {
                header: `<i class="icon text-center text-warning bi bi-pencil-square"></i>
						          <h4 class="modal-title text-center" id="modal-prototype-label">Actualizar Empleado - ${data.id}</h4>`,
                body: `<form class="d-flex flex-column gap-4" id="form-update" action="/configuracion/empleado/actualizar" method="POST">		
                    <input type="hidden"  id="codEmployed" name="id" value="${data.id}"/>
							
                    <div class="row align-items-sm-center">
                      <label class="col-sm-5 fw-bold" for="name">Nombre:</label>
                      <div class="col-sm-7">
                        <input class="form-control" type="text" id="name" name="nameEmpleado" value="${data.nombre}"/>
                        <div id="name-invalid" class="text-start invalid-feedback">Introduce el nombre correctamente. Mínimo 3 caracteres, máximo 20.</div>
                      </div>
                    </div>

                    <div class="row align-items-sm-center">
                      <label class="col-sm-5 fw-bold" for="name">Apellido:</label>
                      <div class="col-sm-7">
                        <input class="form-control" type="text" id="apellido" name="lastnameEmpleado" value="${data.apellido}"/>
                        <div id="name-invalid" class="text-start invalid-feedback">Introduce el apellido correctamente. Mínimo 3 caracteres, máximo 20.</div>
                      </div>
                    </div>

                    <div class="row align-items-sm-center">
                      <label class="col-sm-5 fw-bold" for="name">DNI:</label>
                      <div class="col-sm-7">
                        <input class="form-control" type="text" id="dni" name="dni" value="${data.dni}"/>
                        <div id="dni-invalid" class="text-start invalid-feedback">Introduce un número válido. Solo acepta 9 dígitos y comienza con 9.</div>
                      </div>
                    </div>

                    <div class="row align-items-sm-center">
                      <label class="col-sm-5 fw-bold" for="name">Correo:</label>
                      <div class="col-sm-7">
                        <input class="form-control" type="text" id="correo" name="correo" value="${data.usuario.correo}"/>
                        <div id="correo-invalid" class="text-start invalid-feedback">Introduce un correo válido.</div>
                      </div>
                    </div>

                    <div class="row align-items-sm-center">
                      <label class="col-sm-5 fw-bold" for="name">Telefono:</label>
                      <div class="col-sm-7">
                        <input class="form-control" type="text" id="telefono" name="telefono" value="${data.telefono}"/>
                        <div id="telefono-invalid" class="text-start invalid-feedback">Introduce la categoría de plato correctamente. Mínimo 3 caracteres, máximo 20.</div>
                      </div>
                    </div>

                    <div class="row align-items-sm-center">
                      <label class="col-sm-5 fw-bold">Cargo:</label>
                      <div class="col-sm-7">
                        <select class="form-select" name="cargo" style="text-transform: capitalize">
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
									<div id="name-invalid" class="text-start invalid-feedback">Introduce el nombre correctamente. Mínimo 3 caracteres, máximo 20.</div>
								</div>
                </div>

                <div class="row align-items-sm-center">
								<label class="col-sm-5 fw-bold" for="name">Apellido:</label>
								<div class="col-sm-7">
									<input class="form-control" type="text" id="apellido" name="lastnameEmpleado" value=""/>
									<div id="apellido-invalid" class="text-start invalid-feedback">Introduce el apellido correctamente. Mínimo 3 caracteres, máximo 20.</div>
								</div>
                </div>

                <div class="row align-items-sm-center">
								<label class="col-sm-5 fw-bold" for="name">DNI:</label>
								<div class="col-sm-7">
									<input class="form-control" type="text" id="dni" name="dni" value=""/>
									<div id="dni-invalid" class="text-start invalid-feedback">Introduce un número válido. Solo acepta 9 dígitos y comienza con 9.</div>
								</div>
                </div>

                <div class="row align-items-sm-center">
								<label class="col-sm-5 fw-bold" for="name">Correo:</label>
								<div class="col-sm-7">
									<input class="form-control" type="text" id="correo" name="correo" value=""/>
									<div id="correo-invalid" class="text-start invalid-feedback">Introduce un correo válido.</div>
								</div>
                </div>

                <div class="row align-items-sm-center">
								<label class="col-sm-5 fw-bold" for="name">Telefono:</label>
								<div class="col-sm-7">
									<input class="form-control" type="text" id="telefono" name="telefono" value=""/>
									<div id="telefono-invalid" class="text-start invalid-feedback">Introduce la categoría de plato correctamente. Mínimo 3 caracteres, máximo 20.</div>
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

    const $btnConfirmAdd = $("#add")[0];
    const $btnConfirmUpdate = $("#update")[0];

    if ($btnConfirmAdd == e.target || $btnConfirmUpdate == e.target) {
      const $inputName = $d.getElementById("name");
      const $inputApellido = $d.getElementById("apellido");
      const $inputCorreo = $d.getElementById("correo");
      const $inputTelefono = $d.getElementById("telefono");
      const $divEmailInvalid = $d.getElementById("correo-invalid");
      const $divTelephoneInvalid = $d.getElementById("telefono-invalid");
      const $inputDni = $d.getElementById("dni");
      const $divDniInvalid = $d.getElementById("dni-invalid");
      const $form = $d.getElementById("form-add") || $d.getElementById("form-update");

      let isInvalid = false;

      if (!$inputName.value.match("^(?=.{3,40}$)[A-ZÑÁÉÍÓÚ][a-zñáéíóú]+(?: [A-ZÑÁÉÍÓÚ][a-zñáéíóú]+)*$")) {
        if (!$inputName.classList.contains("is-invalid"))
          $inputName.classList.add("is-invalid");
        isInvalid = true;
      } else {
        if ($inputName.classList.contains("is-invalid"))
          $inputName.classList.remove("is-invalid");
      }

      if (!$inputApellido.value.match("^(?=.{3,40}$)[A-ZÑÁÉÍÓÚ][a-zñáéíóú]+(?: [A-ZÑÁÉÍÓÚ][a-zñáéíóú]+)*$")) {
        if (!$inputApellido.classList.contains("is-invalid"))
          $inputApellido.classList.add("is-invalid");
        isInvalid = true;
      } else {
        if ($inputApellido.classList.contains("is-invalid"))
          $inputApellido.classList.remove("is-invalid");
      }

      if (!$inputCorreo.value.match('^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$')) {
        if ($divEmailInvalid.textContent != "Introduce un correo válido.") {
          $divEmailInvalid.textContent = "Introduce un correo válido.";
        }

        if (!$inputCorreo.classList.contains("is-invalid")) {
          $inputCorreo.classList.add("is-invalid");
        }

        isInvalid = true;
      } else {
        let codemployed = 0;

        if ($btnConfirmUpdate) {
          codemployed = $d.getElementById("codEmployed").value;
          console.log(codemployed);
        }

        const data = await $.get(`/configuracion/empleado/verificar-correo/${$inputCorreo.value}/${codemployed}`);
        console.log("Correo", data.isFound);

        if (data.isFound) {
          $divEmailInvalid.textContent = `No se permiten Correo duplicados. Se encontró un registro con el Telefono ${$inputCorreo.value}. Introduce un nuevo Correo.`;
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

      if (!$inputTelefono.value.match('^9[0-9]{8}$')) {
        if ($divTelephoneInvalid.textContent != "Introduce un número válido. Solo acepta 9 dígitos y comienza con 9.") {
          $divTelephoneInvalid.textContent = "Introduce un número válido. Solo acepta 9 dígitos y comienza con 9.";
        }

        if (!$inputTelefono.classList.contains("is-invalid")) {
          $inputTelefono.classList.add("is-invalid");
        }
        isInvalid = true;
      } else {
        let codemployed = 0;

        if ($btnConfirmUpdate) {
          codemployed = $d.getElementById("codEmployed").value;
          console.log(codemployed);
        }

        const data = await $.get(`/configuracion/empleado/verificar-telefono/${$inputTelefono.value}/${codemployed}`);
        console.log("telefono", data.isFound);

        if (data.isFound) {
          $divTelephoneInvalid.textContent = `No se permiten Télefonos duplicados. Se encontró un registro con el Telefono ${$inputTelefono.value}. Introduce un nuevo Telefono.`;
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

      if (!$inputDni.value.match('^[0-9]{8}$')) {
        if ($divDniInvalid.textContent != "Introduce un dni válido que contenga 8 dígitos.") {
          $divDniInvalid.textContent = "Introduce un dni válido que contenga 8 dígitos.";
        }
        if (!$inputDni.classList.contains("is-invalid")) {
          $inputDni.classList.add("is-invalid");
        }
        isInvalid = true;
      } else {
        let codemployed = 0;

        if ($btnConfirmUpdate) {
          codemployed = $d.getElementById("codEmployed").value;
          console.log(codemployed);
        }

        const data = await $.get(`/configuracion/empleado/verificar-dni/${$inputDni.value}/${codemployed}`);
        console.log("Dni", data.isFound);

        if (data.isFound) {
          console.log(data.isFound);
          $divDniInvalid.textContent = `No se permiten DNI duplicados. Se encontró un registro con el DNI ${$inputDni.value}. Introduce un nuevo DNI.`;
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

      if (!isInvalid) {
        $form.submit();
      }
    }
  });
};


