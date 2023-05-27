import { showModal } from "./modal.js";

const $d = document;

$d.addEventListener("DOMContentLoaded", () => {
  initializeTable();
  addEventToTable();
  addEventToButtonAdd();
  addEventToButtonConfirmAddAndConfirmUpdate();
});

const initializeTable = () => {
  const table = $("#tablaCategoriaPlato").DataTable({
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
      $("#tablaCategoriaPlato thead tr th").each(function (i) {
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
  $("#tablaCategoriaPlato tbody").on(
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
        $.get(`/configuracion/categoria-plato/obtener/${id}`, (data) => {
          if (data) {
            const contentModal = {
              header: `<i class="icon text-center text-link bi bi-info-circle-fill"></i>
										 <h4 class="modal-title text-center" id="modal-prototype-label">Categoría de Plato - ${data.id}</h4>`,
              body: `<div class="text-center">
											<div><strong>Nombre de la Categoría: </strong>${data.nombre}</div>
										</div>`,
              footer: `<button data-bs-dismiss="modal" aria-label="Close" class="w-100 btn btn-primary">CERRAR</button>`,
            };

            showModal(contentModal);
          }
        });
      }

      if ($listBtnUpdate.filter(e.currentTarget).length) {
        $.get(`/configuracion/categoria-plato/obtener/${id}`, (data) => {
          if (data) {
            const contentModal = {
              header: `<i class="icon text-center text-warning bi bi-pencil-square"></i>
											<h4 class="modal-title text-center" id="modal-prototype-label">Categoría de Plato - ${data.id}</h4>`,
              body: `<form class="d-flex flex-column gap-4" id="form-update" action="/configuracion/categoria-plato/actualizar" method="POST">					
											<input type="hidden" name="id" value="${data.id}"/>
		
											<div class="row align-items-sm-center">
												<label class="col-sm-5 fw-bold" for="name">Nombre de la Categoría:</label>
												<div class="col-sm-7">
													<input class="form-control" type="text" id="name" name="name" value="${data.nombre}"/>
													<div id="name-invalid" class="text-start invalid-feedback">Introduce la categoría de plato correctamente. Mínimo 3 caracteres, máximo 20'.</div>
												</div>
											</div>		
										</form>`,
              footer: `<input id="update" form="form-update" type="submit" class="w-50 text-white btn btn-warning" value="MODIFICAR"/>
										<button data-bs-dismiss="modal" aria-label="Close" class="w-50 btn btn-primary">CANCELAR</button>	`,
            };

            showModal(contentModal);
          }
        });
      }

      if ($listBtnDelete.filter(e.currentTarget).length) {
        const contentModal = {
          header: `<i class="icon text-center text-danger bi bi-trash-fill"></i>
						<h4 class="modal-title text-center" id="modal-prototype-label">¿ESTÁS SEGURO DE ELIMINAR LA CATEGORIA DE PLATO - ${id}?</h4>`,
          body: `<form id="form-delete" action="/configuracion/categoria-plato/eliminar" method="POST">
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
    const contentModal = {
      header: `<i class="icon text-center text-primary bi bi-plus-circle-fill"></i>
						<h4 class="modal-title text-center" id="modal-prototype-label">Nueva Categoría de Plato</h4>`,
      body: `<form class="d-flex flex-column gap-4" id="form-add" action="/configuracion/categoria-plato/grabar" method="POST">		
							<div class="row align-items-sm-center">
								<label class="col-sm-5 fw-bold" for="name">Nombre de la Categoría:</label>
								<div class="col-sm-7">
									<input class="form-control" type="text" id="name" name="name" value=""/>
									<div id="name-invalid" class="text-start invalid-feedback">Introduce la categoría de plato correctamente. Mínimo 3 caracteres, máximo 20.</div>
								</div>
							</div>
						</form>`,
      footer: `<input id="add" form="form-add" type="submit" class="w-50 btn btn-primary" value="AÑADIR"/>
						<button data-bs-dismiss="modal" aria-label="Close" class="w-50 btn btn-primary">CANCELAR</button>`,
    };

    showModal(contentModal);
  });
};

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

/* if (object == "categoryDish") {
        let params = {
          type: "findDishInCategoryDish",
          id,
        };

        let props = {
          url: "categoria-plato?" + new URLSearchParams(params),
          success: async (json) => {
            let quantityOfDishesFound = (await json)["quantityOfDishesFound"];

            console.log(quantityOfDishesFound);

            // Regla del Negocio: No se puede eliminar una categoria esté siendo referenciada por uno o más platos
            if (quantityOfDishesFound) {
              contentModal = {
                header: `<i class="icon text-center text-danger bi bi-exclamation-circle-fill"></i>
										<h4 class="modal-title text-center" id="modal-prototype-label">NO SE PUEDE ELIMINAR LA CATEGORÍA - ${id}</h4>`,
                body: `<p>No se puede eliminar la categoría debido a que se encontró ${quantityOfDishesFound} ${
                  quantityOfDishesFound > 1 ? "platos" : "plato"
                } en dicha categoría.</p>`,
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
      }
 */
