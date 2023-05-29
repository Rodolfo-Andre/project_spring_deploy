import { showModal } from "./modal.js";

const $d = document;

$($d).ready(function () {
  initializeTable();
  addEventToTable();
  addEventToButtonAdd();
  addEventToButtonConfirmAddAndConfirmUpdate();
});

const initializeTable = () => {
  const table = $("#tableMesas").DataTable({
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
      { orderable: false, searchable: false, width: 50 },
      { orderable: false, searchable: false, width: 50 },
      { orderable: false, searchable: false, width: 50 },
    ],
    initComplete: function () {
      $("#tableMesas thead tr th").each(function (i) {
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
  $("#tableMesas tbody").on(
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
        $.get(`/configuracion/mesa/obtener/${id}`, (data) => {
          if (data) {
            const contentModal = {
              header: `<i class="icon text-center text-link bi bi-info-circle-fill"></i>
									 <h4 class="modal-title text-center" id="modal-prototype-label">Mesa - ${data.id}</h4>`,
              body: `<div class="text-center">
										<div><strong>Cantidad de Asientos: </strong>${data.cantidadAsientos}</div>
										<div><strong>Estado de la Mesa: </strong>${data.estado}</div>
									</div>`,
              footer: `<button data-bs-dismiss="modal" aria-label="Close" class="w-100 btn btn-primary">CERRAR</button>`,
            };

            showModal(contentModal);
          }
        });
      }

      if ($listBtnUpdate.filter(e.currentTarget).length) {
        $.get(`/configuracion/mesa/obtener/${id}`, (data) => {
          if (data) {
            const contentModal = {
              header: `<i class="icon text-center text-warning bi bi-pencil-square"></i>
										<h4 class="modal-title text-center" id="modal-prototype-label">Mesa - ${data.id}</h4>`,
              body: `<form class="d-flex flex-column gap-4" id="form-update" action="/configuracion/mesa/actualizar" method="POST">
										<input type="hidden" name="id" value="${data.id}"/>
												
										<div class="row align-items-sm-center">
											<label class="col-sm-5 fw-bold" for="name">Cantidad de Asientos:</label>
											<div class="col-sm-7">
												<input class="form-control" type="text" id="quantityChairs" name="quantityChairs" value="${data.cantidadAsientos}"/>
												<div id="name-invalid" class="text-start invalid-feedback">Introduce la cantidad de asientos correctamente. Solo se acepta 1 dígito.</div>
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
						<h4 class="modal-title text-center" id="modal-prototype-label">¿ESTÁS SEGURO DE ELIMINAR LA MESA - ${id}?</h4>`,
          body: `<form id="form-delete" action="/configuracion/mesa/eliminar" method="POST">
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
						<h4 class="modal-title text-center" id="modal-prototype-label">Nueva Mesas</h4>`,
      body: `<form class="d-flex flex-column gap-4" id="form-add" action="/configuracion/mesa/grabar"  method="POST">
							<div class="row align-items-sm-center">
								<label class="col-sm-5 fw-bold" for="name">Cantidad de Asientos:</label>
								<div class="col-sm-7">
									<input class="form-control" type="text"  id="quantityChairs" name="quantityChairs" value=""/>
									<div id="name-invalid" class="text-start invalid-feedback">Introduce la cantidad de asientos correctamente. Solo se acepta 1 dígito.</div>
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

    if (
      $btnConfirmAdd == e.currentTarget ||
      $btnConfirmUpdate == e.currentTarget
    ) {
      let $inputQuantityChairs = $d.getElementById("quantityChairs");

      let isInvalid = false;

      if (!$inputQuantityChairs.value.match("^[1-9]$")) {
        if (!$inputQuantityChairs.classList.contains("is-invalid"))
          $inputQuantityChairs.classList.add("is-invalid");
        isInvalid = true;
      } else {
        if ($inputQuantityChairs.classList.contains("is-invalid"))
          $inputQuantityChairs.classList.remove("is-invalid");
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

/*
    if ($listBtnDelete.includes(e.target)) {
      let $btnDelete = e.target,
        $inputId = $btnDelete.parentNode.parentNode.querySelector(
          ".data > input[name='id']"
        );

      let id = $inputId.value;

      let contentModal = {
        header: `<i class="icon text-center text-danger bi bi-trash-fill"></i>
						<h4 class="modal-title text-center" id="modal-prototype-label">¿ESTÁS SEGURO DE ELIMINAR LA MESA - ${id}?</h4>`,
        body: `<form id="form-delete" action="mesas" method="POST">
							<input type="hidden" name="type" value="deleteInfoObject"/>
							<input type="hidden" name="id" value="${id}"/>
						</form>`,
        footer: `<input form="form-delete" type="submit" class="w-50 text-white btn btn-danger" value="ELIMINAR"/>
						<button data-bs-dismiss="modal" aria-label="Close" class="w-50 btn btn-primary">CANCELAR</button>`,
      };

      let params = {
        type: "findTableInComanda",
        id,
      };

      let props = {
        url: "mesas?" + new URLSearchParams(params),
        success: async (json) => {
          let { foundTableInComanda } = await json;

          if (foundTableInComanda) {
            contentModal = {
              header: `<i class="icon text-center text-danger bi bi-exclamation-circle-fill"></i>
									<h4 class="modal-title text-center" id="modal-prototype-label">NO SE PUEDE ELIMINAR LA MESA - ${id}</h4>`,
              body: `<p>No se puede eliminar la mesa porque se encontró comandas que utilizan esta mesa.</p>`,
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
    }*/
