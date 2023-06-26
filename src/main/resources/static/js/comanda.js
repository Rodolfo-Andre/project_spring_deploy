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
      this.estadoUsuario = $("#txt-estado-usuario");
    },
    getComandas: function () {
      let me = this;
      const url = this.contextUrl + this.apis.listar;
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if (!data.length) {
            $("#tableComandas")
              .html(`<span class="text-center">${me.estadoUsuario == "ROLE_COCINERO"? "No hay comandas" : "No hay mesas disponibles"}</span>`)
              .addClass("justify-content-center");
            this.showNoTablesModal();
            return;
          }

          this.generateComanda(data);
        });
    },
    generateComanda: function (data) {
       const container =   $("#tableComandas");
      const listContainer = [];

      const promises = data.map((element, i) => {
        if (element.estado == "Ocupado") {
          const url = `/configuracion/comanda/comanda-libre/${element.id}`;
          return fetch(url)
            .then((response) => response.json())
            .then((comanda) => {
              if (comanda) {
                return { template: this.templateComanda().cardComandaOcupada(comanda), index: i };
              }
            })
            .catch((error) => {
              console.error("Error en la solicitud AJAX:", error);
            });
        } else {
          return { template: this.templateComanda().cardComandaDisponible(element), index: i };
        }
      });
       
      Promise.all(promises).then((values) => {
        values.forEach((element) => {
          if (element) {
            listContainer[element.index] = element.template;
          }
         
        });
        container.html(listContainer.join(""));
        $(".js-container-comanda").on("click", function (ev) {
          const id = $(this).data("id");
          window.location.href = "/configuracion/comanda/detalle/" + id;
        });
      } );
    

  

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
    showNoTablesModal: function (text) {
      const contentModal = {
        header: `<i class="icon text-center text-danger bi bi-exclamation-circle-fill"></i>	
                    <h4 class="modal-title text-center" id="modal-prototype-label">NO HAY ${text} </h4>`,
        body: `<p style="text-align: justify;">No se puede realizar ninguna acción porque no exiten ${text.toLowerCase()}</p>`,
        footer: `<button data-bs-dismiss="modal" aria-label="Close" class="w-100 btn btn-danger">CERRAR</button>`,
      };

      showModal(contentModal);
    },
    getCurrentUser: async function () {
      const result = await $.ajax("/usuario");
      return result;
    },
    convertDate: function (date) {
      let d = new Date(date);
      let ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d);
      let mo = new Intl.DateTimeFormat("en", { month: "2-digit" }).format(d);
      let da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d);
      return `${da}/${mo}/${ye}`;
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
        cardComandaOcupada: function (data) {
          console.log(data);
          return `
          <div class="card mx-auto  bg-danger text-white js-container-comanda pointer" style="max-width: 180px;cursor:pointer" data-id="${data.mesa.id}">
          <div class="card-body d-flex flex-column justify-content-between">
            <h1 class="h5 title text-center">Mesa: ${data.mesa.id}</h1>
            <div class="d-grid gap-2 pb-3  ">
              <span class="h6 ">
                <i class="bi bi-person"></i>
                  S./ ${data.cantidadAsientos}
              </span>
              <span class="h6 ">
                <i class="bi bi-calendar"></i>
                 ${data.fechaEmision}
              </span>
              <span>
                S./ ${data.precioTotal}
              </span>
            </div>
            <h5 class="text-center mt-auto font-weight-bold text-uppercase">
              ${data.mesa.estado}
            </h5>
          </div>
        </div>
          `;
        },
        cardComandaDisponible: function (data) {
            return `
            <div class="card mx-auto  bg-success text-white js-container-comanda" style="max-width: 180px; height: 220px;" data-id="${data.id}">
            <div class="card-body d-flex flex-column justify-content-between">
              <h1 class="h5 title text-center">Mesa: ${data.id}</h1>
              <div class="d-grid gap-2 pb-3  ">
                <span class="h6 mt-2 d-flex align-items-center gap-2">
                 <i class="bi bi-tablet-landscape-fill"></i>
                   ${data.cantidadAsientos}
                </span>
              </div>
              <h5 class="text-center mt-auto font-weight-bold text-uppercase">
                ${data.estado}
              </h5>
            </div>
          </div>
            `
        },

      };
    },
  };
};

$(function () {
  let view = new ViewCore();
  view.Core.init();
});
