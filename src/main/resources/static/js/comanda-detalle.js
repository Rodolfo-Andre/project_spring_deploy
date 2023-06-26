import { showModal } from "./modal.js";
import { ViewCoreFactura } from "./factura.js";

const ViewCore = function () {
  this.Core = {
    contextUrl: "/configuracion/comanda",
    apis: {
      listar: "/listar",
      save: "/registrar",
    },
    init: async function () {
      const response = await fetch("/usuario", {
        headers: {
          "content-type": "application/json",
        },
      });

      const { empleado } = await response.json();

      if (
        ["ROLE_ADMINISTRADOR", "ROLE_MESERO", "ROLE_CAJERO"].includes(
          empleado.cargo.nombre
        )
      ) {
        this.viewFactura = new ViewCoreFactura();
        await this.viewFactura.Core.init();
      }

      this.txtNumeroComanda = $("#txt-numero-comanda");
      this.IdUsuario = $("#txt-id-usuario");

      this.txtEstadoMesa = $("#txt-estado-mesa");
      this.txtNumeroMesa = $("#txt-numero-mesa");
      this.txtCantidadPersonas = $("#txt-cantidad-persona");
      this.mesaCantidadPersonas = $("#txt-numero-personas");
      this.txtEstadoComanda = $("#txt-estado-comanda");
      this.txtEmpleado = $("#txt-empleado");
      this.btnDelete = $("#btn-del-plato");
      this.txtPrecioTotal = $("#txt-total");
      this.txtCantidadMaxima = $("#txt-cantidad-maxima");
      this.btnGenerar = $("#btn-guardar-comanda");
      this.containerError = $("#container-error");
      this.btnAddPlato = $("#btn-add-plato");
      this.btnActualizar = $("#btn-actualizar-comanda");
      this.btnActualizarEstado = $("#btn-actualizar-estado-comanda");
      this.listaDeEnvioPlatos = [];
      this.listaDeCategoriaDePlatos = [];

      this.modalFactura = $("#modalFactura");
      this.btnFacturar = $("#btn-facturar-comanda");
      this.getCategoriaPlato();

      //values modal
      this.txtPrecioTotal.val(0);

      if (this.txtEstadoMesa.val() == "Ocupado") {
        await this.obtenerComandaPorId(this.getUrlParameter());
      }
      this.attachEvents();
    },
    attachEvents: function () {
      let me = this;
      this.btnAddPlato.on("click", function (ev) {
        me.modalPlato();
      });

      this.btnGenerar.on("click", function (ev) {
        ev.preventDefault();

        const condicion =
          me.listaDeEnvioPlatos.length <= 0 ||
          me.txtCantidadPersonas.val() == 0;
        me.containerError.empty();

        if (condicion) {
          const errorSave = me.showError(
            "Debe agregar platos y/o cantidad de personas"
          );

          me.containerError.append(errorSave);
          return;
        }

        const condicion2 =
          parseInt(me.txtCantidadPersonas.val()) >
          parseInt(me.mesaCantidadPersonas.val());

        me.containerError.empty();
        if (condicion2) {
          const message =
            "La cantidad de personas no puede ser mayor a la cantidad de asientos de la mesa , Numero de asientos de la mesa : " +
            me.mesaCantidadPersonas.val();

          const errorSave = me.showError(message);

          me.containerError.append(errorSave);

          return;
        }

        me.containerError.empty();

        me.saveComanda();
      });

      this.btnActualizar.on("click", function (ev) {
        ev.preventDefault();

        const condicion =
          me.listaDeEnvioPlatos.length <= 0 ||
          me.txtCantidadPersonas.val() == 0;
        me.containerError.empty();
        if (condicion) {
          const errorSave = me.showError(
            "Debe agregar platos y/o cantidad de personas"
          );

          me.containerError.append(errorSave);
          return;
        }

        me.containerError.empty();

        me.saveComanda();
      });

      this.btnActualizarEstado.on("click", function (ev) {
        ev.preventDefault();

        me.updateComandaStatus();
      });

      this.btnDelete.on("click", function (ev) {
        ev.preventDefault();
        const contentModal = {
          header: `<i class="icon text-center text-danger bi bi-trash-fill"></i>
						<h4 class="modal-title text-center" id="modal-prototype-label">¿ESTÁS SEGURO DE ELIMINAR LA COMANDA - ${parseInt(
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

      this.btnFacturar.on("click", function (ev) {
        ev.preventDefault();
        me.modalFactura.modal("show");

        me.viewFactura.Core.setPedidos(me.listaDeEnvioPlatos);
      });

      this.txtCantidadPersonas.on("keyup", function (ev) {
        ev.preventDefault();
        const val = ev.target.value;

        if (val == "") {
          me.txtCantidadPersonas.val(1);
          return;
        }

        if (val <= 0) {
          me.txtCantidadPersonas.val(1);
          return;
        }

        if (val > 15) {
          me.txtCantidadPersonas.val(15);
          return;
        }

        me.txtCantidadPersonas.val(val);
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
      let me = this;
      const url = "/configuracion/categoria-plato/obtener";
      return new Promise((resolve, reject) => {
        $.ajax({
          url: url,
          type: "GET",
          dataType: "json",
          success: function (response) {
            me.listaDeCategoriaDePlatos = response;
            resolve(response);
          },
          error: function (error) {
            reject(error);
          },
        });
      });
    },
    getPlato: async function (categoriaId) {
      const url = `/configuracion/plato/obtener-by-categoria/${categoriaId}`;
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
    modalPlato: async function (dataModal) {
      const categorias = await this.getCategoriaPlato();
      let me = this;
      let listPlatos = [];
      let plato = {};
      const contentModal = {
        header: `<i class="icon text-center text-primary bi ${
          dataModal ? "bi-pencil-square text-warning" : "bi-plus-circle-fill"
        }"></i>
                            <h4 class="modal-title text-center" id="modal-prototype-label">
                            ${dataModal ? "Editar Plato" : "Agregar Plato"}
                            </h4>
                            <div 
                             style="display: none"
                            class="alert alert-danger m-2" id="error-platos">
                            </div>`,
        body: `<form class="d-flex flex-column gap-4" id="form-add"  method="POST">		
                <div class="row align-items-sm-center">
                        <label class="col-sm-5 fw-bold">Cateogria:</label>
                    <div class="col-sm-7">
                    <select 
                        id="categoria" 
                        ${dataModal ? "disabled" : ""}
                        value="${dataModal ? dataModal.categoriaPlato.id : ""}"
                        class="form-select" name="categoria" style="text-transform: capitalize">
                        <option value="">Seleccione</option>
                        ${categorias.map((categoria) => {
                          return `<option value="${categoria.id}" ${
                            dataModal &&
                            dataModal.categoriaPlato.id === categoria.id
                              ? "selected"
                              : ""
                          }>${categoria.nombre}</option>`;
                        })}
                    </select>
                     </div>
              </div>
    
              <div class="row align-items-sm-center">
                        <label class="col-sm-5 fw-bold">Plato:</label>
                    <div class="col-sm-7">
                    <select 
                     id="plato"
                      ${dataModal ? "disabled" : ""}
                      value="${dataModal ? dataModal.id : ""}"
                    class="form-select" name="plato" style="text-transform: capitalize">
                    <option value="">Seleccione</option>
                    </select>
                     </div>
              </div>
    
                    <div class="row align-items-sm-center">
                                    <label class="col-sm-5 fw-bold" for="name">Cantidad:</label>
                                    <div class="col-sm-7">
                                        <input 
                                        value="${
                                          dataModal ? dataModal.cantidad : 0
                                        }"
                                         id="cantidadDePedido"
                                        class="form-control" type="number" id="name" name="cantidad" />
                                    </div>
                    </div>

                    <div class="row align-items-sm-center">
                    <label class="col-sm-5 fw-bold" for="name">Observacion:</label>
                    <div class="col-sm-7">
                        <input 
                         id="txt-observacion"
                        class="form-control" 
                        value="${dataModal ? dataModal.observacion : ""}"
                        type="text" id="name" name="observacion" />
                    </div>
    </div>
    
                            </form>`,
        footer: `<button id="add"  class="w-50 btn ${
          dataModal ? "btn-warning text-white" : "btn-primary"
        }"  > 
         ${dataModal ? "EDITAR" : "AGREGAR"}
        </button>
        <button data-bs-dismiss="modal" aria-label="Close" class="w-50 btn btn-primary">CANCELAR</button>`,
      };

      showModal(contentModal);
      $("#categoria").change(async function (e) {
        const categoria = $("#categoria").val();
        const platos = await me.getPlato(categoria);

        $("#plato").html("");
        listPlatos = platos;

        $("#plato")
          .prop("disabled", dataModal)
          .append(`<option value="">Seleccione</option>`);

        platos.map((plato) => {
          $("#plato").append(
            `<option value="${plato.id}" ${
              dataModal && dataModal.id === plato.id ? "selected" : ""
            }>${plato.nombre}</option>`
          );
        });
      });

      $("#cantidadDePedido").on("keyup", function (e) {
        const val = parseInt($(this).val());

        if (val > 15) {
          $(this).val(15);
        }

        if (val < 0) {
          $(this).val(1);
        }

        if (isNaN(val)) {
          $(this).val(1);
        }

        if (val == "") {
          $(this).val(1);
        }
      });

      if (dataModal) {
        $("#categoria").trigger("change");
      }

      $("#plato").change(async function (e) {
        const platoId = $("#plato").val();
        plato = listPlatos.find((plato) => plato.id == platoId);
      });

      $("#add").click(function (e) {
        e.preventDefault();

        const platoId = $("#plato").val();
        const cantidad = parseInt($("#cantidadDePedido").val()) || 0;

        if (!platoId) {
          me.showMessage("Seleccione un plato", "error", "Error!");
          return;
        }

        if (cantidad <= 0 || !cantidad || isNaN(cantidad) || cantidad == "") {
          me.showMessage("Ingrese una cantidad valida", "error", "Error!");
          return;
        }

        if (cantidad > 16) {
          me.showMessage("Ingrese una cantidad menor a 15", "error", "Error!");
          return;
        }

        const observacion = $("#txt-observacion").val();

        if (dataModal) {
          dataModal.cantidad = parseInt(cantidad);
          dataModal.observacion = observacion;
          me.initTable(dataModal);
          me.showMessage(
            "Plato editado correctamente",
            "success",
            "Exito!"
          ).then(() => {
            $("#modal-prototype").modal("hide");
          });
          return;
        }

        const exitePlato = me.listaDeEnvioPlatos.find(
          (plato) => plato.id == platoId
        );

        if (exitePlato) {
          me.showMessage("El plato ya fue agregado", "error", "Error!");
          return;
        }

        let data = {
          id: platoId,
          imagen: plato.imagen,
          nombre: plato.nombre,
          cantidad: cantidad,
          categoriaPlato: plato.categoriaPlato,
          precio: plato.precioPlato,
        };

        $("#cantidadDePedido").val(1);
        const errors = Object.keys(data).filter((key) => {
          return (
            data[key] == "" ||
            data[key] == null ||
            (data[key] == undefined && key != "observacion")
          );
        });
        if (errors.length > 0) {
          $("#error-platos")
            .text("Todos los campos son obligatorios")
            .css("display", "block");
          return;
        }

        data.observacion = observacion;

        $("#error-platos").text("").css("display", "none");
        me.initTable(data);
        me.showMessage(
          "Plato añadido correctamente",
          "success",
          "Agregado"
        ).then(() => {
          $("#modal-prototype").modal("hide");
        });
      });
    },
    addPlatoToTable: function (data) {
      let me = this;
      me.initTable(data);
    },
    obtenerComandaPorId: async function (id) {
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

        if (data.estadoComanda.estado == "Preparado") {
          me.btnFacturar.css("display", "block");
        }

        data.listaDetalleComanda.forEach((plato) => {
          listado.push({
            id: plato.plato.id,
            imagen: plato.plato.imagen,
            nombre: plato.plato.nombre,
            cantidad: plato.cantidadPedido,
            categoriaPlato: plato.plato.categoriaPlato,
            precio: plato.plato.precioPlato,
            observacion: plato.observacion,
          });
        });

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
    saveComanda: async function () {
      let me = this;
      const listIdPlatos = this.listaDeEnvioPlatos.map((plato) => ({
        id: plato.id,
        cantidad: plato.cantidad,
        observacion: plato.observacion,
      }));

      const baseUrl = this.contextUrl + this.apis.save;
      const baseData = {
        id: me.txtNumeroComanda.val(),
        numeroMesa: parseInt(this.txtNumeroMesa.val()) ?? 0,
        precioTotal: parseFloat(this.txtPrecioTotal.val()) ?? 0,
        cantidadPersonas: parseInt(this.txtCantidadPersonas.val()),
        listaPlatos: listIdPlatos,
        idUsuario: me.IdUsuario.val(),
      };

      if (
        baseData.cantidadPersonas <= 0 ||
        baseData.cantidadPersonas == "" ||
        isNaN(baseData.cantidadPersonas)
      ) {
        me.showError("La cantidad de personas no puede ser menor o igual a 0");
        me.containerError.append(ext);
        return;
      }
      me.containerError.empty();
      try {
        me.btnGenerar.prop("disabled", true);
        me.btnActualizar.prop("disabled", true);

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

        this.showMessage(message, "error", "Comanda");
      } finally {
        me.btnGenerar.prop("disabled", false);
        me.btnActualizar.prop("disabled", false);
      }
    },
    updateComandaStatus: async function () {
      let me = this;
      const url =
        this.contextUrl + `/preparar-comanda/${this.txtNumeroComanda.val()}`;

      try {
        this.btnActualizarEstado.prop("disabled", true);

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
        });

        const { message, status } = await response.json();

        this.showMessage(message, status, "Comanda").then((response) => {
          if (response.isConfirmed) {
            window.location.href = this.contextUrl;
          }
        });
      } catch (error) {
        const message = error.message ?? "Error al actualizar la comanda";
        this.showMessage(message, "error", "Comanda");
      } finally {
        this.btnActualizarEstado.prop("disabled", false);
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
    initTable: function (data = null) {
      let me = this;

      $("#tbBodyPlatos").html("");

      if (data != null && data != undefined) {
        const plato = me.listaDeEnvioPlatos.find(
          (plato) => plato.id == data.id
        );
        if (plato != undefined) {
          plato.cantidad = parseInt(plato.cantidad);
          plato.observacion = data.observacion;
        } else {
          me.listaDeEnvioPlatos.push(data);
        }
      }

      if (me.listaDeEnvioPlatos.length > 0) {
        const columnas = $("#tablaDetalleComanda > thead > tr th")
          .map(function () {
            return $(this).text().trim();
          })
          .get();

        const controles = [
          `<td> 
              <button class="btn btn-warning btn-sm js-btn-edit">
                <i class="bi bi-pencil-fill"></i>
              </button>
            </td>`,
          `<td>
              <button class="btn btn-danger btn-sm js-btn-delete">
                <i class="bi bi-trash-fill"></i>    
              </button>
            </td>`,
        ];

        const obtenerControler = () => {
          if (columnas.includes("Editar") && columnas.includes("Eliminar")) {
            return controles.join(",");
          }

          if (columnas.includes("Editar")) {
            return controles[0];
          }

          if (columnas.includes("Eliminar")) {
            return controles[1];
          }

          return "";
        };

        me.listaDeEnvioPlatos.forEach((plato) => {
          $("#tbBodyPlatos").append(`
          <tr data-id="${plato.id}" class="align-middle">
            <td>${plato.id}</td>
            <td>
              <img src="${plato.imagen}" alt="" width="50" height="50">
            </td>
            <td
            class="js-nombre"
            >${plato.nombre}</td>
            <td
            class="js-cantidad"
            >${plato.cantidad}</td>
            <td>${plato.categoriaPlato.nombre}</td>
            <td
            class="js-total"
            >${plato.precio * plato.cantidad}</td>
            <td>
              <button class="btn btn-primary btn-sm js-btn-info">
                <i class="bi bi-info-square-fill"></i>
              </button>
            </td>
            ${obtenerControler()}
          </tr>`);
        });
      }
      const total = me.listaDeEnvioPlatos.reduce((total, plato) => {
        return total + plato.precio * plato.cantidad;
      }, 0);

      me.txtPrecioTotal.val(total);

      $(".js-btn-edit").click(function (e) {
        e.preventDefault();
        const id = $(this).parents("tr").data("id");
        const plato = me.listaDeEnvioPlatos.find((plato) => plato.id == id);
        me.modalPlato(plato);
      });

      $(".js-btn-delete").click(function (e) {
        e.preventDefault();
        const id = $(this).parents("tr").data("id");
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

      $(".js-btn-info").click(function (e) {
        e.preventDefault();
        const id = $(this).parents("tr").data("id");

        const plato = me.listaDeEnvioPlatos.find((plato) => plato.id == id);
        me.modalObservacion(plato);
        console.log(me.listaDeEnvioPlatos);
      });
    },
    showError: function (mesage) {
      return ` <div 
                                class="alert alert-danger alert-dismissible fade show col-12 col-md-8 col-lg-6 "
                                role="alert" id="alerta-error">
                                <strong>¡Error!</strong> <span id="mensaje-error">
                                ${mesage}</span>
                                <button type="button" class="btn-close" data-bs-dismiss="alert"
                                    aria-label="Close"></button>
   </div>`;
    },
    modalObservacion: function (plato) {
      const contentModal = {
        header: `<i class="icon text-center text-link bi bi-info-circle-fill"></i>
						<h4 class="modal-title text-center" id="modal-prototype-label">INFORMACIÓN DEL ${plato.nombre.toUpperCase()}</h4>`,
        body: `<p class="text-center m-0"><b>Observación:</b> ${
          plato.observacion || "Sin observación"
        }</p>`,
        footer: `<button data-bs-dismiss="modal" aria-label="Close" class="w-100 btn btn-primary">CANCELAR</button>`,
      };

      showModal(contentModal);
    },
  };
};

$(function () {
  let view = new ViewCore();
  view.Core.init();
});
