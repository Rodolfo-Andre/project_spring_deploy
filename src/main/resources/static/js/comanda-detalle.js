import { showModal } from "./modal.js";

const ViewCore = function () {
  this.Core = {
    contextUrl: "/configuracion/comanda",
    apis: {
      listar: "/listar",
      save: "/registrar",
    },
    init: async function () {
      let me = this;
      this.txtNumeroComanda = $("#txt-numero-comanda");
      this.txtEstadoMesa = $("#txt-estado-mesa");
      this.txtNumeroMesa = $("#txt-numero-mesa");
      this.txtCantidadPersonas = $("#txt-cantidad-persona");
      this.txtEstadoComanda = $("#txt-estado-comanda");
      this.txtEmpleado = $("#txt-empleado");
      this.btnDelete = $("#btn-del-plato");
      this.txtPrecioTotal = $("#txt-total");
      this.txtCantidadMaxima = $("#txt-cantidad-maxima");
      this.btnGenerar = $("#btn-guardar-comanda");
      this.containerError = $("#alerta-error");
      this.btnAddPlato = $("#btn-add-plato");

      this.btnActualizar = $("#btn-actualizar-comanda");
      this.listaDeEnvioPlatos = [];
      this.getCategoriaPlato();

      if (this.txtEstadoMesa.val() == "Ocupado") {
        await this.getSingle(this.getUrlParameter());
      }

      this.attachEvents();
    },
    attachEvents: function () {
      let me = this;
      this.btnAddPlato.on("click", function (ev) {
        console.log("click");
        me.modalPlato();
      });

      this.btnGenerar.on("click", function (ev) {
        ev.preventDefault();

        const condicion =
          me.listaDeEnvioPlatos.length <= 0 ||
          me.txtCantidadPersonas.val() == 0;

        if (condicion) {
          me.containerError
            .css("display", "block")
            .find("#mensaje-error")
            .text("Debe agregar platos y/o cantidad de personas");
          return;
        }

        me.containerError.css("display", "none");

        me.saveComanda();
      });

      this.btnActualizar.on("click", function (ev) {
        ev.preventDefault();

        const condicion =
          me.listaDeEnvioPlatos.length <= 0 ||
          me.txtCantidadPersonas.val() == 0;

        if (condicion) {
          me.containerError
            .css("display", "block")
            .find("#mensaje-error")
            .text("Debe agregar platos y/o cantidad de personas");
          return;
        }

        me.containerError.css("display", "none");

        me.saveComanda();
      });

      this.btnDelete.on("click", function (ev) {
        ev.preventDefault();
        const contentModal = {
          header: `<i class="icon text-center text-danger bi bi-trash-fill"></i>
						<h4 class="modal-title text-center" id="modal-prototype-label">¿ESTÁS SEGURO DE ELIMINAR La Comanda - ${parseInt(
              me.txtNumeroComanda.val()
            )}?</h4>`,
          body: `<form id="form-delete" action="/configuracion/comanda/eliminar" method="POST">
							<input type="hidden" name="id" value="${me.txtNumeroComanda.val()}"/>
						</form>`,
          footer: `<input form="form-delete" type="submit" class="w-50 text-white btn btn-danger" value="ELIMINAR"/>
						<button data-bs-dismiss="modal" aria-label="Close" class="w-50 btn btn-primary">CANCELAR</button>`,
        };

        showModal(contentModal);
      });
    },
    getValues: function () {
      return {
        numeroMesa: this.txtNumeroMesa.val(),
        cantidadAsientos: this.txtCantidadPersonas.val(),
        precioTotal: this.txtPrecioTotal.val(),
        listPlatos: this.listaDeEnvioPlatos,
      };
    },
    getCategoriaPlato: async function () {
      const url = "/configuracion/categoria-plato/obtener";
      return new Promise((resolve, reject) => {
        $.ajax({
          url: url,
          type: "GET",
          dataType: "json",
          success: function (response) {
            resolve(response);
          },
          error: function (error) {
            reject(error);
          },
        });
      });
    },
    getPlato: async function (categoriaId) {
      const url = "/configuracion/plato/obtener";
      return new Promise((resolve, reject) => {
        $.ajax({
          url: url,
          type: "GET",
          dataType: "json",
          success: function (response) {
            const platos = response.filter((plato) => {
              return plato.categoriaPlato.id == categoriaId;
            });

            resolve(platos);
          },
          error: function (error) {
            reject(error);
          },
        });
      });
    },
    modalPlato: async function () {
      const categorias = await this.getCategoriaPlato();
      let me = this;
      let listPlatos = [];
      let plato = {};
      const contentModal = {
        header: `<i class="icon text-center text-primary bi bi-plus-circle-fill"></i>
                            <h4 class="modal-title text-center" id="modal-prototype-label">Nuevo Empleado</h4>

                            <div 
                             style="display: none"
                            class="alert alert-danger m-2" id="error-platos">
                            </div>
                            
                            `,
        body: `<form class="d-flex flex-column gap-4" id="form-add" action="/configuracion/empleado/registrar" method="POST">		
                <div class="row align-items-sm-center">
                        <label class="col-sm-5 fw-bold">Cateogria:</label>
                    <div class="col-sm-7">
                    <select 
                        id="categoria" class="form-select" name="categoria" style="text-transform: capitalize">
                        <option value="">Seleccione</option>
                        ${categorias.map((categoria) => {
                          return `<option value="${categoria.id}">${categoria.nombre}</option>`;
                        })}
                    </select>
                     </div>
              </div>
    
              <div class="row align-items-sm-center">
                        <label class="col-sm-5 fw-bold">Plato:</label>
                    <div class="col-sm-7">
                    <select 
                     id="plato"
                     disabled
                    class="form-select" name="plato" style="text-transform: capitalize">
                    <option value="">Seleccione</option>
                    </select>
                     </div>
              </div>
    
                    <div class="row align-items-sm-center">
                                    <label class="col-sm-5 fw-bold" for="name">Cantidad:</label>
                                    <div class="col-sm-7">
                                        <input 
                                         id="cantidadDePedido"
                                        class="form-control" type="number" id="name" name="cantidad" />
                                    </div>
                    </div>
    
                            </form>`,
        footer: `<button id="add"  class="w-50 btn btn-primary"  > AÑADIR</button>
        <button data-bs-dismiss="modal" aria-label="Close" class="w-50 btn btn-primary">CANCELAR</button>`,
      };

      showModal(contentModal);
      $("#categoria").change(async function (e) {
        const categoria = $("#categoria").val();
        const platos = await me.getPlato(categoria);
        $("#plato").html("");
        listPlatos = platos;

        $("#plato")
          .prop("disabled", false)
          .append(`<option value="">Seleccione</option>`);
        platos.map((plato) => {
          $("#plato").append(
            `<option value="${plato.id}">${plato.nombre}</option>`
          );
        });
      });
      $("#plato").change(async function (e) {
        const platoId = $("#plato").val();
        plato = listPlatos.find((plato) => plato.id == platoId);
      });

      $("#add").click(function (e) {
        e.preventDefault();
        const platoId = $("#plato").val();
        const cantidad = $("#cantidadDePedido").val();

        let data = {
          id: platoId,
          imagen: plato.imagen,
          nombre: plato.nombre,
          cantidad: cantidad,
          categoriaPlato: plato.categoriaPlato,
          precio: plato.precioPlato,
        };
        $("#cantidadDePedido").val("");
        const errors = Object.keys(data).filter((key) => {
          return data[key] == "" || data[key] == null || data[key] == undefined;
        });
        if (errors.length > 0) {
          $("#error-platos")
            .text("Todos los campos son obligatorios")
            .css("display", "block");
          return;
        }

        $("#error-platos").text("").css("display", "none");

        me.addPlatoToTable(data, cantidad);
      });
    },
    addPlatoToTable: function (data) {
      let me = this;

      const exits = me.listaDeEnvioPlatos.find((plato) => plato.id == data.id);
      if (exits) {
        exits.cantidad = parseInt(exits.cantidad) + parseInt(data.cantidad);
        $(`tr[data-id="${exits.id}"]`).remove();
        data = exits;
        me.listaDeEnvioPlatos = me.listaDeEnvioPlatos.filter(
          (plato) => plato.id != data.id
        );
      }

      $("#tbBodyPlatos").append(`<tr
      data-id="${data.id}"
      >
      <td>${data.id}</td>
      <td>
      <img src="${data.imagen}" alt="" width="50" height="50">
        </td>
        <td>${data.nombre}</td>
        <td>${data.cantidad}</td>
        <td>${data.categoriaPlato.nombre}</td>
        <td>${data.precio * data.cantidad}</td>
        <td>
            <button class="btn btn-danger btn-sm js-btn-delete">
            <i class="bi bi-trash-fill"></i>    
            </button>
            </td>
            </tr>`);

      me.listaDeEnvioPlatos.push(data);
      console.log(me.listaDeEnvioPlatos);
      const total = me.listaDeEnvioPlatos.reduce((total, plato) => {
        return total + plato.precio * plato.cantidad;
      }, 0);

      me.txtPrecioTotal.val(total);

      $(".js-btn-delete").click(function (e) {
        e.preventDefault();
        const id = $(this).parents("tr").data("id");
        console.log("id", id);
        me.listaDeEnvioPlatos = me.listaDeEnvioPlatos.filter(
          (plato) => plato.id != id
        );
        $(this).parents("tr").remove();
        me.txtPrecioTotal.val(
          me.listaDeEnvioPlatos.reduce((total, plato) => {
            return total + plato.precio * plato.cantidad;
          }, 0)
        );
      });
    },

    getSingle: async function (id) {
      let me = this;

      try {
        const url = "/configuracion/comanda/obtener/" + id;
        const response = await fetch(url);
        const data = await response.json();
        me.txtCantidadPersonas.val(data.cantidadAsientos);
        me.txtEmpleado.val(data.empleado.nombre + " " + data.empleado.apellido);
        me.txtPrecioTotal.val(data.precioTotal);
        me.txtEstadoComanda.val(data.estadoComanda.estado);
        const listado = [];
        console.log(data.listaDetalleComanda);

        data.listaDetalleComanda.forEach((plato) => {
          listado.push({
            id: plato.plato.id,
            imagen: plato.plato.imagen,
            nombre: plato.plato.nombre,
            cantidad: plato.cantidadPedido,
            categoriaPlato: plato.plato.categoriaPlato,
            precio: plato.plato.precioPlato,
          });
        });

        console.log(listado);

        this.listaDeEnvioPlatos = listado;

        me.initTable();
      } catch (error) {
        console.log(error);

        // me.showMessage("Error!", "error", "Error al obtener la comanda").then(
        //   (response) => {
        //     if (response.isConfirmed) {
        //       window.location.href = "/configuracion/comanda";
        //     }
        //   }
        // );
      }
    },

    deleteComanda: async function (id) {},

    saveComanda: async function () {
      let me = this;
      const listIdPlatos = this.listaDeEnvioPlatos.map((plato) => ({
        id: plato.id,
        cantidad: plato.cantidad,
      }));
      console.log(this.txtEstadoMesa.val());
      
      const baseUrl = this.contextUrl + this.apis.save;
      const baseData = {
        id:
          this.txtEstadoMesa.val() == "Ocupado"
            ? parseInt(me.txtNumeroComanda.val())
            : null,
        numeroMesa: parseInt(this.txtNumeroMesa.val()) ?? 0,
        precioTotal: parseFloat(this.txtPrecioTotal.val()) ?? 0,
        cantidadPersonas: parseInt(this.txtCantidadPersonas.val()),
        listaPlatos: listIdPlatos,
      };

      try {
        const response = await fetch(baseUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(baseData),
        });
        const data = await response.json();

        this.showMessage(
          "Comanda registrada correctamente",
          "success",
          "Comanda"
        ).then((response) => {
          if (response.isConfirmed) {
            window.location.href = this.contextUrl;
          }
        });
      } catch (error) {
        const message = error.message ?? "Error al registrar la comanda";
        console.log(error);

        this.showMessage(
          "Ocurrio un error al registrar la comanda",
          "error",
          "Comanda"
        );
      }
    },
    showMessage: function (message, icon, title, ...options) {
      return Swal.fire({
        title: title,
        text: message,
        icon: icon,
        ...options,
      });
    },
    getUrlParameter: function () {
      var urlCompleta = window.location.href;
      var url = new URL(urlCompleta);
      var valor = url.pathname.split("/").pop();

      return valor;
    },

    initTable: function () {
      let me = this;
      const listado = this.listaDeEnvioPlatos;

      if (listado.length > 0) {
        listado.forEach((plato) => {
          console.log(plato);

          $("#tbBodyPlatos").append(`<tr
        data-id="${plato.id}"
        >
        <td>${plato.id}</td>
        <td>
        <img src="${plato.imagen}" alt="" width="50" height="50">
          </td>
          <td>${plato.nombre}</td>
          <td>${plato.cantidad}</td>
          <td>${plato.categoriaPlato.nombre}</td>
          <td>${plato.precio * plato.cantidad}</td>
          <td>
              <button class="btn btn-danger btn-sm js-btn-delete">
              <i class="bi bi-trash-fill"></i>    
              </button>
              </td>
              </tr>`);
        });
      }

      $(".js-btn-delete").click(async function (e) {
        e.preventDefault();
        const id = $(this).parents("tr").data("id");
        console.log(id);

        try {
          const url = "/configuracion/comanda/eliminar-comanda";
          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              platoID: id,
              comandaID: parseInt(me.txtNumeroComanda.val()),
            }),
          });

          const data = await response.json();

          if (data.status == "error") {
            me.listaDeEnvioPlatos = me.listaDeEnvioPlatos.filter(
              (plato) => plato.id != id
            );

            $(this).parents("tr").remove();
            me.txtPrecioTotal.val(
              me.listaDeEnvioPlatos.reduce((total, plato) => {
                return total + plato.precio * plato.cantidad;
              }, 0)
            );
          } else {
            me.listaDeEnvioPlatos = me.listaDeEnvioPlatos.filter(
              (plato) => plato.id != id
            );

            $(this).parents("tr").remove();
            me.txtPrecioTotal.val(
              me.listaDeEnvioPlatos.reduce((total, plato) => {
                return total + plato.precio * plato.cantidad;
              }, 0)
            );
          }
        } catch (error) {
          console.log(error);

          me.showMessage(
            "Ocurrio un error al eliminar el plato",
            "error",
            "Error"
          );
        }
      });
    },
  };
};

$(function () {
  let view = new ViewCore();
  view.Core.init();
});
