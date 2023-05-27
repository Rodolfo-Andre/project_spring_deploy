import { showModal } from "./modal.js";

const $d = document;

$d.addEventListener("DOMContentLoaded", () => {
  initializeTable();
  addEventToTable();
  addEventToButtonAdd();
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
                      <div><strong>Fecha de registro del empleado: </strong>${
                        data.fechaRegistro
                      }</div>
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

          $.get(`/configuracion/empleado/obtener/${id}`, (data) => {
            if (data) {
              const contentModal = {
                header: `<i class="icon text-center text-warning bi bi-pencil-square"></i>
						          <h4 class="modal-title text-center" id="modal-prototype-label">Actualizar Empleado - ${data.id}</h4>`,
                body: `<form class="d-flex flex-column gap-4" id="form-add" action="/configuracion/empleado/actualizar" method="POST">		
                    <input type="hidden" name="id" value="${data.id}"/>
							
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
									<input class="form-control" type="text" id="name" name="lastnameEmpleado" value="${data.apellido}"/>
									<div id="name-invalid" class="text-start invalid-feedback">Introduce el apellido correctamente. Mínimo 3 caracteres, máximo 20.</div>
								</div>
                </div>

                <div class="row align-items-sm-center">
								<label class="col-sm-5 fw-bold" for="name">DNI:</label>
								<div class="col-sm-7">
									<input class="form-control" type="text" id="name" name="dni" value="${data.dni}"/>
									<div id="name-invalid" class="text-start invalid-feedback">Introduce la categoría de plato correctamente. Mínimo 3 caracteres, máximo 20.</div>
								</div>
                </div>

                <div class="row align-items-sm-center">
								<label class="col-sm-5 fw-bold" for="name">Correo:</label>
								<div class="col-sm-7">
									<input class="form-control" type="text" id="name" name="correo" value="${data.usuario.correo}"/>
									<div id="name-invalid" class="text-start invalid-feedback">Introduce la categoría de plato correctamente. Mínimo 3 caracteres, máximo 20.</div>
								</div>
                </div>

                <div class="row align-items-sm-center">
								<label class="col-sm-5 fw-bold" for="name">Telefono:</label>
								<div class="col-sm-7">
									<input class="form-control" type="text" id="name" name="telefono" value="${data.telefono}"/>
									<div id="name-invalid" class="text-start invalid-feedback">Introduce la categoría de plato correctamente. Mínimo 3 caracteres, máximo 20.</div>
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
                footer: `<input id="update" form="form-update" type="submit" class="w-50 text-white btn btn-warning" value="MODIFICAR"/>
										<button data-bs-dismiss="modal" aria-label="Close" class="w-50 btn btn-primary">CANCELAR</button>`,
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
						<button data-bs-dismiss="modal" aria-label="Close" class="w-50 btn btn-primary">CANCELAR</button>`,
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
									<input class="form-control" type="text" id="name" name="lastnameEmpleado" value=""/>
									<div id="name-invalid" class="text-start invalid-feedback">Introduce el apellido correctamente. Mínimo 3 caracteres, máximo 20.</div>
								</div>
                </div>

                <div class="row align-items-sm-center">
								<label class="col-sm-5 fw-bold" for="name">DNI:</label>
								<div class="col-sm-7">
									<input class="form-control" type="text" id="name" name="dni" value=""/>
									<div id="name-invalid" class="text-start invalid-feedback">Introduce la categoría de plato correctamente. Mínimo 3 caracteres, máximo 20.</div>
								</div>
                </div>

                <div class="row align-items-sm-center">
								<label class="col-sm-5 fw-bold" for="name">Correo:</label>
								<div class="col-sm-7">
									<input class="form-control" type="text" id="name" name="correo" value=""/>
									<div id="name-invalid" class="text-start invalid-feedback">Introduce la categoría de plato correctamente. Mínimo 3 caracteres, máximo 20.</div>
								</div>
                </div>

                <div class="row align-items-sm-center">
								<label class="col-sm-5 fw-bold" for="name">Telefono:</label>
								<div class="col-sm-7">
									<input class="form-control" type="text" id="name" name="telefono" value=""/>
									<div id="name-invalid" class="text-start invalid-feedback">Introduce la categoría de plato correctamente. Mínimo 3 caracteres, máximo 20.</div>
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
						<button data-bs-dismiss="modal" aria-label="Close" class="w-50 btn btn-primary">CANCELAR</button>`,
      };

      showModal(contentModal);
    });
  });
};

/*
const addEventToButtonConfirmAddAndConfirmUpdate = () => {
  $($d).on("click", "#add, #update", (e) => {
    const $btnConfirmAdd = $("#add")[0],
      $btnConfirmUpdate = $("#update")[0];

    if ($btnConfirmAdd == e.target || $btnConfirmUpdate == e.target) {
      let $inputName = $d.getElementById("name");
      let isInvalid = false;

      if (
        !$inputName.value.match(
          "^(?=.{3,20}$)[A-ZÑÁÉÍÓÚ][a-zñáéíóú]+(?: [A-Za-zñáéíóú]+)*$"
        )
      ) {
        if (!$inputName.classList.contains("is-invalid"))
          $inputName.classList.add("is-invalid");
        isInvalid = true;
      } else {
        if ($inputName.classList.contains("is-invalid"))
          $inputName.classList.remove("is-invalid");
      }

      if (isInvalid) {
        e.preventDefault();
        return;
      }
    }
  });
};
*/
