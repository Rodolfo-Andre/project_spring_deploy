import { showModal } from "./modal.js";

const $d = document;

$d.addEventListener("DOMContentLoaded", () => {
  initializeTable();
  addEventToTable();
  addEventToButtonAdd();
});

const initializeTable = () => {
  const table = $("#tablaCaja").DataTable({
    language: {
      url: "/language/datatables-es-mx.json",
    },
    responsive: true,
    fixedHeader: true,
    rowId: "0",
    columns: [null, { orderable: false, searchable: false, width: 50 }],
    initComplete: function () {
      $("#tablaCaja thead tr th").each(function (i) {
        const title = $(this).text();

        if (!["Eliminar"].includes(title)) {
          $("input", this).on("keyup change", function () {
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
  $("#tablaCaja tbody").on("click", "td .icon-delete", function (e) {
    let id;

    const $listBtnDelete = $(".icon-delete");

    if ($(this).parents("tr").hasClass("child")) {
      id = $(this).parents("tr").prev().find("td:eq(0)").text();
    } else {
      id = $(this).closest("tr").find("td:eq(0)").text();
    }

    if ($listBtnDelete.filter(e.currentTarget).length) {
      const contentModal = {
        header: `<i class="icon text-center text-danger bi bi-trash-fill"></i>
                <h4 class="modal-title text-center" id="modal-prototype-label">¿ESTÁS SEGURO DE ELIMINAR LA CAJA - ${id}?</h4>`,
        body: `<form id="form-delete" action="/configuracion/caja/eliminar" method="POST">
							<input type="hidden" name="id" value="${id}"/>
						</form>`,
        footer: `<input form="form-delete" type="submit" class="w-50 text-white btn btn-danger" value="ELIMINAR"/>
						<button data-bs-dismiss="modal" aria-label="Close" class="w-50 btn btn-primary">CANCELAR</button>`,
      };

      showModal(contentModal);
    }
  });
};

const addEventToButtonAdd = () => {
  $("#btn-add").on("click", () => {
    const contentModal = {
      header: `<i class="icon text-center text-primary bi bi-plus-circle-fill"></i>
						<h4 class="modal-title text-center" id="modal-prototype-label">Añadir Caja</h4>`,
      body: `<form class="d-flex flex-column gap-4" id="form-add" action="/configuracion/caja/grabar" method="POST">		
								<span class="text-center fw-semibold">¿Seguro que deseas agregar una caja?</span>	
						</form>`,
      footer: `<input id="add" form="form-add" type="submit" class="w-50 btn btn-primary" value="AÑADIR"/>
						<button id="btn-cancel" data-bs-dismiss="modal" aria-label="Close" class="w-50 btn btn-danger">CANCELAR</button>`,
    };

    showModal(contentModal);
  });
};
