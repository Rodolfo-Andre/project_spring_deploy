import { showModal } from "./modal.js";

const $d = document;

$d.addEventListener("DOMContentLoaded", () => {
  initializeTable();
  addEventToTable();
  addEventToButtonAdd();
  addEventToButtonConfirmAddAndConfirmUpdate();
});

const initializeTable = () => {
  const table = $("#tablaMetodoPago").DataTable({
    language: {
      url: "/language/datatables-es-mx.json",
    },
    responsive: true,
    fixedHeader: true,
    rowId: "0",
    columns: [
      null,
      null,
      { orderable: false, searchable: false, width: 50 },
      { orderable: false, searchable: false, width: 50 },
      { orderable: false, searchable: false, width: 50 },
    ],
    initComplete: function () {
      $("#tablaMetodoPago thead tr th").each(function (i) {
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
  $("#tablaMetodoPago tbody").on(
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
        $.get(`/configuracion/metodo-pago/obtener/${id}`, (data) => {
          if (data) {
            const contentModal = {
              header: `<i class="icon text-center text-link bi bi-info-circle-fill"></i>
									 <h4 class="modal-title text-center" id="modal-prototype-label">Método de Pago - ${data.id}</h4>`,
              body: `<div class="text-center">
										<div><strong>Nombre del Método: </strong>${data.metodo}</div>
									</div>`,
              footer: `<button data-bs-dismiss="modal" aria-label="Close" class="w-100 btn btn-primary">CERRAR</button>`,
            };

            showModal(contentModal);
          }
        });
      }

      if ($listBtnUpdate.filter(e.currentTarget).length) {
        $.get(`/configuracion/metodo-pago/obtener/${id}`, (data) => {
          if (data) {
            const contentModal = {
              header: `<i class="icon text-center text-warning bi bi-pencil-square"></i>
										<h4 class="modal-title text-center" id="modal-prototype-label">Método de Pago - ${data.id}</h4>`,
              body: `<form class="d-flex flex-column gap-4" id="form-update" action="/configuracion/metodo-pago/actualizar" method="POST">
										<input type="hidden" name="id" value="${data.id}"/>
								
										<div class="row align-items-sm-center">
											<label class="col-sm-5 fw-bold" for="name">Nombre del Método:</label>
											<div class="col-sm-7">
												<input class="form-control" type="text" id="name" name="name" value="${data.metodo}"/>
												<div id="name-invalid" class="text-start invalid-feedback">Introduce el método de pago correctamente. Mínimo 3 caracteres, máximo 40.</div>
											</div>
										</div>		
									</form>`,
              footer: `<input id="update" form="form-update" type="submit" class="w-50 text-white btn btn-warning" value="MODIFICAR"/>
									<button id="btn-cancel" data-bs-dismiss="modal" aria-label="Close" class="w-50 btn btn-danger">CANCELAR</button>	`,
            };

            showModal(contentModal);
          }
        });
      }

      if ($listBtnDelete.filter(e.currentTarget).length) {
        const contentModal = {
          header: `<i class="icon text-center text-danger bi bi-trash-fill"></i>
						<h4 class="modal-title text-center" id="modal-prototype-label">¿ESTÁS SEGURO DE ELIMINAR EL MÉTODO DE PAGO - ${id}?</h4>`,
          body: `<form id="form-delete" action="/configuracion/metodo-pago/eliminar" method="POST">
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
    const contentModal = {
      header: `<i class="icon text-center text-primary bi bi-plus-circle-fill"></i>
						<h4 class="modal-title text-center" id="modal-prototype-label">Nuevo Método de Pago</h4>`,
      body: `<form class="d-flex flex-column gap-4" id="form-add" action="/configuracion/metodo-pago/grabar" method="POST">
							<div class="row align-items-sm-center">
								<label class="col-sm-5 fw-bold" for="name">Nombre del Método:</label>
								<div class="col-sm-7">
									<input class="form-control" type="text" id="name" name="name" value=""/>
									<div id="name-invalid" class="text-start invalid-feedback">Introduce el método de pago correctamente. Mínimo 3 caracteres, máximo 40.</div>
								</div>
							</div>
						</form>`,
      footer: `<input id="add" form="form-add" type="submit" class="w-50 btn btn-primary" value="AÑADIR"/>
						<button id="btn-cancel" data-bs-dismiss="modal" aria-label="Close" class="w-50 btn btn-danger">CANCELAR</button>`,
    };

    showModal(contentModal);
  });
};

const addEventToButtonConfirmAddAndConfirmUpdate = () => {
  $($d).on("click", "#add, #update", (e) => {
    const $btnConfirmAdd = $("#add")[0],
      $btnConfirmUpdate = $("#update")[0];
    e.preventDefault();
    if ($btnConfirmAdd == e.target || $btnConfirmUpdate == e.target) {
      let $inputName = $d.getElementById("name");

      let isInvalid = false;

      if (
        !$inputName.value.match(
          "^(?=.{3,40}$)[A-ZÑÁÉÍÓÚ][A-ZÑÁÉÍÓÚa-zñáéíóú]+(?: [A-ZÑÁÉÍÓÚa-zñáéíóú]+)*$"
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

    const $form = $(e.target.form);
    const $loader = $(`<div class="flex-grow-1 text-center">
                        <div class="spinner-border text-primary" role="status">
                          <span class="visually-hidden">Loading...</span>
                        </div>
                        </div>`);

    $(e.target).replaceWith($loader);
    $("#btn-cancel").prop("disabled", true);

    $form.submit();
  });
};

/* if ($listBtnDelete.includes(e.target)) {
      let $btnDelete = e.target,
        $inputId = $btnDelete.parentNode.parentNode.querySelector(
          ".data > input[name='id']"
        );

      let id = $inputId.value;

      let contentModal = {
        header: `<i class="icon text-center text-danger bi bi-trash-fill"></i>
						<h4 class="modal-title text-center" id="modal-prototype-label">¿ESTÁS SEGURO DE ELIMINAR EL MÉTODO DE PAGO - ${id}?</h4>`,
        body: `<form id="form-delete" action="metodo-pago" method="POST">
							<input type="hidden" name="type" value="deleteInfoObject"/>
							<input type="hidden" name="id" value="${id}"/>
						</form>`,
        footer: `<input form="form-delete" type="submit" class="w-50 text-white btn btn-danger" value="ELIMINAR"/>
						<button data-bs-dismiss="modal" aria-label="Close" class="w-50 btn btn-primary">CANCELAR</button>`,
      };

      let params = {
        type: "findMetPayInCDP",
        id,
      };

      let props = {
        url: "metodo-pago?" + new URLSearchParams(params),
        success: async (json) => {
          let { foundMetPayInCDP } = await json;

          if (foundMetPayInCDP) {
            contentModal = {
              header: `<i class="icon text-center text-danger bi bi-exclamation-circle-fill"></i>
									<h4 class="modal-title text-center" id="modal-prototype-label">NO SE PUEDE ELIMINAR EL MÉTODO DE PAGO - ${id}</h4>`,
              body: `<p>No se puede eliminar el método de pago porque se encontró comprobantes de pagos que utilizan este método de pago.</p>`,
              footer: `<button data-bs-dismiss="modal" aria-label="Close" class="w-100 btn btn-danger">CERRAR</button>`,
            };
          }

          showModal(contentModal);
        },
        options: {
          method: "POST",
        },
      };

      useFetch(props);
    } */
