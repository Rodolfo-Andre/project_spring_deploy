import { showModal } from "./modal.js";

const $d = document;

$d.addEventListener("DOMContentLoaded", () => {
  initializeTable();
  addEventToTable();
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
    ],

    initComplete: function () {
      $("#tablaEmpleado thead tr th").each(function (i) {
        const title = $(this).text();

        if (!["Información", "Modificar", "Eliminar", "PDF"].includes(title)) {
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

      const $listBtnInfo = $(".icon-info");

      if ($(this).parents("tr").hasClass("child")) {
        id = $(this).parents("tr").prev().find("td:eq(0)").text();
      } else {
        id = $(this).closest("tr").find("td:eq(0)").text();
      }

      if ($listBtnInfo.filter(e.currentTarget).length) {
        $.get(
          `/configuracion/comprobante/obtener-comprobante/${id}`,
          (data) => {
            console.log(data);

            const fechaRegistro = new Date(data.fechaEmision);
            const formattedFechaRegistro = `${fechaRegistro.getFullYear()}-${
              fechaRegistro.getMonth() + 1
            }-${fechaRegistro.getDate()}`;

            if (data) {
              const contentModal = {
                header: `<i class="icon text-center text-link bi bi-info-circle-fill"></i>
										 <h4 class="modal-title text-center" id="modal-prototype-label">Comprobante - ${data.id}</h4>`,
                body: `<div class="text-center">
						<div><strong>Cliente: </strong>${
              data.cliente.nombre + " " + data.cliente.apellido
            }</div>
                      <div><strong>Fecha Emision: </strong>${formattedFechaRegistro}</div>
                      <div><strong>SubTotal: </strong>${data.subTotal}</div>
                      <div><strong>Descuento: </strong>${data.descuento}</div>
                      <div><strong>Total: </strong>${
                        data.precioTotalPedido
                      }</div>
                      <div><strong>Tipo Comprobante: </strong>${
                        data.tipoComprobante.tipo
                      }</div>
                      <div><strong>Comanda: </strong>${data.comanda.id}</div>
                      <div><strong>Caja: </strong>${data.caja.id}</div>
                      <div>===============================================================</div>

                      <div class="py-2">
                      ${
                        data.listaDetalleComprobante.length > 0 &&
                        data.listaDetalleComprobante.map(
                          (detalle) =>
                            `<div
                             class="d-flex justify-content-between align-items-center"
                            ><strong>${detalle.metodoPago.metodo}:</strong>S./${detalle.montoPago}</div>`
                        )
                      }
                      </div>
                      



										</div>`,
                footer: `<button data-bs-dismiss="modal" aria-label="Close" class="w-100 btn btn-primary">CERRAR</button>`,
              };

              showModal(contentModal);
            }
          }
        );
      }
    }
  );
};
