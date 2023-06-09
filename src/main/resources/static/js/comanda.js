import { showModal } from "./modal.js";

const ViewCore = function () {
  this.Core = {
    contextUrl: "/configuracion/mesa",
    apis: {
      listar: "/obtener",
    },
    init: function () {
      this.getComandas();
      this.bntAddComanda = $("#btn-add");
    },
    getComandas: function () {
      const url = this.contextUrl + this.apis.listar;
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);

          if (!data.length) {
            $("#tableComandas").html(
              `<span class="text-center">Sin Mesas</span>`
            );
            this.showNoTablesModal();
            return;
          }

          this.generateComanda(data);
        });
    },
    generateComanda: function (data) {
      let html = "";

      data.forEach((element) => {
        if (element.estado == "Ocupado") {
          const url = `/configuracion/comanda/comanda-libre/${element.id}`;
          fetch(url)
            .then((response) => response.json())
            .then((comanda) => {
              console.log(comanda);

              if (comanda) {
                html += `
                <div class="card col-12 col-xl-5 m-3 border-4 border-danger js-container-comanda" 
                  data-id="${element.id}">
                  <div class="card-body d-flex flex-column justify-content-center align-items-center">
                    <h5 class="card-title text-center">ID: ${element.id}</h5>
                    
                    <h5 class="card-title text-center text-danger">
                    ${element.estado}
                    </h5>
                    
                    <h5 class="card-title text-center">
                    Empleado: ${comanda.empleado.nombre}
                    </h5>
                    
                    <h5 class="card-title text-center ">
                    Fecha: ${comanda.fechaEmision}
                    </h5>
                    
                    <h5 class="card-title text-center ">
                    Estado: ${comanda.estadoComanda.estado}
                    </h5>
                   
                    <h5 class="card-title text-center">
                    Precio comanda: ${comanda.precioTotal}
                    </h5> 
                  </div>
                </div>
              `;
              }

              $("#tableComandas").html(html);

              $(".js-container-comanda").on("click", function (ev) {
                const id = $(this).data("id");
                window.location.href = "/configuracion/comanda/detalle/" + id;
              });
            })
            .catch((error) => {
              console.error("Error en la solicitud AJAX:", error);
            });
        } else {
          html += `
          <div class="card col-12 col-xl-5 m-3 
                border-4 border-success js-container-comanda"
                data-id="${element.id}"
                c>
                <div class="card-body d-flex flex-column justify-content-center align-items-center">
                  <h5 class="card-title text-center">ID: ${element.id}</h5>
                  <h5 class="card-title text-center text-success">
                    ${element.estado}
                  </h5>
                  <h5 class="card-title text-center text-success">
                  </h5>
                </div>
              </div>
        `;
        }
      });

      $("#tableComandas").html(html);
      $(".js-container-comanda").on("click", function (ev) {
        const id = $(this).data("id");
        window.location.href = "/configuracion/comanda/detalle/" + id;
      });
    },
    showInfoComanda: function (id) {
      const data = {
        id: null,
        cantidadAsientos: 4,
        precioTotal: id,
        mesa: {
          id: null,
          cantidadAsientos: 4,
          estado: "Disponible",
        },
        estadoComanda: {
          id: null,
          estado: "Pendiente",
        },
        empleado: {
          id: null,
          nombre: "John",
          apellido: "Doe",
          telefono: "123456789",
          dni: "12345678",
          fechaRegistro: "2023-05-27T09:17:06.599+00:00",
          cargo: null,
          usuario: null,
        },
        comprobante: null,
      };

      const modalInfo = this.templateComanda().modalInfoComanda(data);
      showModal(modalInfo);
    },
    showNoTablesModal: function () {
      const contentModal = {
        header: `<i class="icon text-center text-danger bi bi-exclamation-circle-fill"></i>	
                    <h4 class="modal-title text-center" id="modal-prototype-label">NO HAY MESAS</h4>`,
        body: `<p>No es posible generar comandas porque no exiten mesas</p>`,
        footer: `<button data-bs-dismiss="modal" aria-label="Close" class="w-100 btn btn-danger">CERRAR</button>`,
      };

      showModal(contentModal);
    },
    deleteComanda: function (id) {
      const url = this.contextUrl + this.apis.delete;
    },
    convertDate: function (date) {
      let d = new Date(date);
      let ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d);
      let mo = new Intl.DateTimeFormat("en", { month: "2-digit" }).format(d);
      let da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d);
      return `${da}/${mo}/${ye}`;
    },
    modalError: function (message) {
      const contentModal = {
        header: `<i class="icon text-center text-danger bi bi-exclamation-circle-fill"></i> `,
        body: `<div class="text-center">
        <div><strong>ERROR:</strong> ${message}</div>
        </div>`,
        footer: `<button data-bs-dismiss="modal" aria-label="Close" class="w-100 btn btn-primary">CERRAR</button>`,
      };

      $(".js-modal-content-comanda").children().remove();
      $(".js-modal-content-comanda").html(contentModal);
      $("#modalInfoComanda").modal("show");
    },
    templateComanda: function () {
      let me = this;

      return {
        modalInfoComanda: function (data) {
          return {
            header: `<i class="icon text-center text-link bi bi-info-circle-fill"></i> `,
            body: `<div class="text-center">
              <div><strong>Numero de la Comanda:</strong> ${data.id}</div>
              <div><strong>Numero de la Mesa:</strong> ${data.mesa.id}</div>
              <div><strong>Estado de la Comanda:</strong> ${
                data.estadoComanda.estado
              }</div>
              <div><strong>Nombre del Empleado:</strong> ${
                data.empleado.nombre + " " + data.empleado.apellido
              }</div>
              <div><strong>Fecha de Registro:</strong> ${me.convertDate(
                data.empleado.fechaRegistro
              )}</div>
              <div><strong>Precio Total:</strong> ${data.precioTotal}</div>
              </div>`,
            footer: `<button data-bs-dismiss="modal" aria-label="Close" class="w-100 btn btn-primary">CERRAR</button>`,
          };
        },
        modalDeleteComanda: function (id) {
          return {
            header: `<i class="icon text-center text-danger bi bi-trash-fill"></i>
                              <h4 class="modal-title text-center" id="modal-prototype-label">¿ESTÁS SEGURO DE ELIMINAR LA CATEGORIA DE PLATO - ${id}?</h4>`,
            body: `<form id="form-delete" >
                                  <input type="hidden" name="id" value="${id}"/>
                              </form>`,
            footer: `<input form="form-delete" type="submit" class="w-50 text-white btn btn-danger" value="ELIMINAR"/>
                              <button data-bs-dismiss="modal" aria-label="Close" class="w-50 btn btn-primary">CANCELAR</button>`,
          };
        },
      };
    },
  };
};

$(function () {
  let view = new ViewCore();
  view.Core.init();
});
