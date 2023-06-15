export const ViewCoreFactura = function () {
  this.Core = {
    contextUrl: "/configuracion/",
    init: function () {
      this.orden = $("#txt-orden");
      this.mesa = $("#txt-mesa");
      this.cboTipoFactura = $("#cbo-tipo-factura");
      this.cboPago = $("#cbo-pago");
      this.monto = $("#txt-monto");
      this.btnAgregarPago = $("#btn-agregar-pago");
      this.numeroDocumento = $("#txt-numero-documento");
      this.numeroDocumento.attr("maxlength", "8");

      this.nombreCliente = $("#txt-nombre-cliente");
      this.apellidoCliente = $("#txt-apellido-cliente");
      this.dniCliente = $("#txt-dni-cliente");
      this.containerPedidos = $(".js-container-pedidos");

      this.containerCardsPago = $(".js-container-cards-pago");
      this.containerError = $(".js-container-errors");
      this.textError = $("#txt-error");

      this.subtotal = $("#txt-subtotal");

      this.txtDescuento = $("#txt-descuento");
      this.btnDescuento = $("#btn-descuento");
      this.descuento = $("#input-descuento");

      this.cboCaja = $("#cbo-caja");

      this.txtTotal = $("#txt-total-factura");
      this.total = 0;
      this.pago = 0;
      this.faltante = 0;
      this.subTotalVal = 0;
      this.txtpago = $("#txt-pago");
      this.faltantetxt = $("#txt-faltante");

      this.igv = $("#txt-igv");
      this.igvValue = 0;
      this.btnCerrar = $("#btn-cerrar");
      this.btnFacturar = $("#btn-facturar");
      this.listaPedidos = [];
      this.listaPagos = [];

      //condicionales

      const cantidadPedidos = this.containerPedidos.children().length;
      if (cantidadPedidos == 0) {
        this.containerPedidos.append(
          `<p class="text-center">No hay pedidos</p>`
        );
      }

      const cantidadPagos = this.containerCardsPago.children().length;

      if (cantidadPagos == 0) {
        this.containerCardsPago.css("display", "none");
      }

      this.getMetodosPago();
      this.getTipoFactura();
      this.getCajas();
      this.initEvents();
    },
    initEvents: function () {
      let me = this;
      this.btnAgregarPago.on("click", () => {
        this.agregarMetodoPago();
      });

      this.numeroDocumento.on("keyup", async (ev) => {
        const { value } = ev.target;
        if (value.length < 8) {
          me.addError(
            "El número de documento no puede tener menos de 8 dígitos"
          );
          return;
        }

        if (value.length == 8) {
          me.clearErrors();
          await me.findCliente();
        }
      });

      this.numeroDocumento.on("input", function () {
        var inputValue = $(this).val();
        if (inputValue.length > 8) {
          $(this).val(inputValue.slice(0, 8));
        }
      });

      this.btnDescuento.on("click", () => {
        const val = parseInt(this.descuento.val());
        console.log(val);
        console.log(typeof val);

        if (typeof val != "number" || isNaN(val)) {
          this.addError("Ingrese un descuento válido");
          return;
        }

        if (val < 0) {
          this.addError("El descuento no puede ser menor a 0");
          return;
        }

        if (this.listaPedidos.length == 0) {
          this.addError("No hay pedidos");
          return;
        }

        if (val > this.total) {
          this.addError("El descuento no puede ser mayor al total");
          return;
        }

        this.clearErrors();

        this.calcularTotal();
      });

      this.btnFacturar.on("click", () => {
        if (this.listaPedidos.length == 0) {
          this.addError("No hay pedidos");
          return;
        }

        if (this.listaPagos.length == 0) {
          this.addError("No hay pagos");
          return;
        }

        if (this.total > this.pago) {
          this.addError("Falta pagar");
          return;
        }

        if (this.cboCaja.val() == "") {
          this.addError("Seleccione una caja");
          return;
        }

        if (this.cboTipoFactura.val() == "") {
          this.addError("Seleccione un tipo de factura");
          return;
        }

        if (this.numeroDocumento.val() == "") {
          this.addError("Ingrese un número de documento");
          return;
        }

        this.clearErrors();

        this.facturar();
      });
    },
    getMetodosPago: function () {
      this.cboPago.empty();

      $.ajax({
        url: this.contextUrl + "metodo-pago/obtener",
        method: "GET",
        dataType: "json",
        contentType: "application/json",
      }).done((data) => {
        this.cboPago.append(`<option value="">--Seleccione--</option>`);
        data.forEach((metodoPago) => {
          this.cboPago.append(
            `<option value="${metodoPago.id}">${metodoPago.metodo}</option>`
          );
        });
      });
    },
    getCajas: function () {
      const url = this.contextUrl + "caja/obtener";

      $.ajax({
        url: url,
        method: "GET",
        dataType: "json",
        contentType: "application/json",
      }).done((data) => {
        console.log(data);

        $("#cbo-caja").append(`<option value="">--Seleccione--</option>`);
        data.forEach((caja) => {
          $("#cbo-caja").append(
            `<option value="${caja.id}">${caja.id}</option>`
          );
        });
      });
    },
    setPedidos: function (pedidos) {
      let me = this;
      this.listaPedidos = pedidos;

      this.containerPedidos.empty();

      pedidos.forEach((pedido) => {
        const pedidosHtml = me.templates.pedido(pedido);

        this.containerPedidos.append(pedidosHtml);
      });

      const cantidadPedidos = this.containerPedidos.children().length;

      if (cantidadPedidos == 0) {
        this.containerPedidos.append(
          `<p class="text-center">No hay pedidos</p>`
        );
      }

      this.calcularTotal();
    },
    findCliente: async function () {
      const numeroDocumento = this.numeroDocumento.val();

      const url =
        this.contextUrl + "comprobante/obtener-cliente/" + numeroDocumento;

      try {
        const response = await fetch(url);

        const data = await response.json();

        this.nombreCliente.val(data.nombre);
        this.apellidoCliente.val(data.apellido);
      } catch (error) {
        console.log(error);
      } finally {
        this.nombreCliente.val("").attr("disabled", false);
        this.apellidoCliente.val("").attr("disabled", false);
      }

      // $.ajax({
      //   url: url,
      //   method: "GET",
      //   dataType: "json",
      //   contentType: "application/json",
      // })
      //   .done((data) => {
      //     console.log(data);
      //     this.nombreCliente.val(data.nombre);
      //     this.apellidoCliente.val(data.apellido);
      //   })
      //   .fail((error) => {
      //     this.nombreCliente.val("").attr("disabled", false);
      //     this.apellidoCliente.val("").attr("disabled", false);
      //   });
    },
    getTipoFactura: function () {
      const url = this.contextUrl + "comprobante/obtener-tipo-comprobante";
      this.cboTipoFactura.empty();
      $.ajax({
        url: url,
        method: "GET",
        dataType: "json",
        contentType: "application/json",
      }).done((data) => {
        this.cboTipoFactura.append(`<option value="">--Seleccione--</option>`);
        data.forEach((tipoFactura) => {
          this.cboTipoFactura.append(
            `<option value="${tipoFactura.id}">${tipoFactura.tipo}</option>`
          );
        });
      });
    },
    agregarMetodoPago: function () {
      const { id, metodo } = {
        id: this.cboPago.val(),
        metodo: this.cboPago.find("option:selected").text(),
      };

      const existe = this.listaPagos.find((pago) => pago.id === id);

      if (existe) {
        this.addError("El método de pago ya fue agregado");
        return;
      } else if (id === "") {
        this.addError("Seleccione un método de pago");
        return;
      } else if (this.monto.val() === "") {
        this.addError("Ingrese un monto");
        return;
      } else {
        this.clearErrors();
      }

      const imagen = this.getImage(metodo);

      const pago = {
        id,
        tituloPago: metodo,
        monto: this.monto.val(),
        imagen: imagen,
      };

      if (pago.monto == 0) {
        this.addError("El monto no puede ser 0");
        return;
      }

      const montoTotal = this.pago + parseFloat(pago.monto);

      const calcularMonto = parseFloat(montoTotal).toFixed(2);
      const calcularTOTAL = parseFloat(this.total).toFixed(2);

      if (calcularMonto > calcularTOTAL) {
        this.addError("El monto no puede ser mayor al total");
        return;
      }
      this.containerCardsPago.append(this.templates.cardPago(pago));
      this.listaPagos.push(pago);
      this.monto.val("");
      this.cboPago.val("");
      this.containerCardsPago.css("display", "block");

      this.containerCardsPago.on("click", ".js-eliminar-metodo-pago", (e) => {
        const id = $(e.target).closest(".card").attr("id");
        console.log(id);
        this.eliminarMetodoPago(id);
      });

      // if (pago.monto > this.total) {
      //   this.addError("El monto no puede ser mayor al total");
      //   return;
      // }

      this.calcularTotal();
    },
    eliminarMetodoPago: function (id) {
      this.listaPagos = this.listaPagos.filter((pago) => pago.id != id);
      $(`#${id}`).remove();
      this.calcularTotal();
    },
    calcularTotal: function () {
      this.pago = 0;
      this.total = 0;
      let subTotal = 0;
      let total = 0;

      let igv = 0;

      this.listaPedidos.forEach((pedido) => {
        const { cantidad, precio } = pedido;

        subTotal += cantidad * precio;
      });
      this.subTotalVal = subTotal;
      total = subTotal;

      this.listaPagos.forEach((pago) => {
        this.pago += parseFloat(pago.monto);
      });

      if (this.descuento.val() != 0 && this.descuento.val() > 0) {
        total -= this.descuento.val();
      }

      igv = total * 0.18;

      this.igvValue = igv;

      total += igv;
      this.total = total;

      this.faltante = this.total - this.pago;

      if (this.faltante <= 0) {
        this.faltante = 0;
      }

      this.faltantetxt.text(this.faltante.toFixed(2));
      this.txtpago.text(this.pago.toFixed(2));
      this.subtotal.text(subTotal.toFixed(2));
      this.txtDescuento.text(parseInt(this.descuento.val()).toFixed(2));
      this.txtTotal.text(total.toFixed(2));
      this.igv.text(igv.toFixed(2));
    },
    addError: function (error) {
      this.containerError.css("display", "block");
      this.textError.text(error);
    },
    clearErrors: function () {
      this.containerError.css("display", "none");
      this.textError.text("");
    },
    facturar: function () {
      const newListaPagos = this.listaPagos.map((pago) => {
        return {
          idTipoPago: pago.id,
          monto: pago.monto,
        };
      });

      this.btnFacturar.attr("disabled", true);
      const url = this.contextUrl + "comprobante/registrar";

      const data = {
        precioTotalPedido: this.total,
        idTipoComprobante: this.cboTipoFactura.val(),
        idComanda: $("#txt-numero-comanda").val(),
        idEmpleado: $("#txt-id-usuario").val(),
        cliente: {
          nombre: this.nombreCliente.val(),
          apellido: this.apellidoCliente.val(),
          dni: this.numeroDocumento.val(),
        },
        listaPagos: newListaPagos,
        descuento: this.descuento.val(),
        idCaja: this.cboCaja.val(),
        igv: this.igvValue,
        subTotal: this.subTotalVal,
      };

      console.log(data);
      $.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify(data),
        contentType: "application/json",
      })
        .done((response) => {
          Swal.fire({
            title: "Comprobante registrado",
            text: "El comprobante se registró correctamente",
            icon: "success",
            confirmButtonText: "Aceptar",
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = this.contextUrl + "comanda";
            }
          });
        })
        .fail((error) => {
          Swal.fire({
            title: "Error",
            text: "Ocurrió un error al registrar el comprobante",
            icon: "error",
            confirmButtonText: "Aceptar",
          });
        })
        .always(() => {
          this.btnFacturar.attr("disabled", false);
        });
    },

    templates: {
      cardPago: function (pago) {
        return `
            <div 
            id="${pago.id}"
            class="card w-100 mb-2">
            <div class="card-body">
                <h5 class="card-title text-center">
                    ${pago.tituloPago}
                </h5>
                <div class="row d-flex align-items-center">
                    <div class="col-6">
                        <p class="card-text">Monto: S/.${pago.monto}</p>
                    </div>
                    <div class="col-6 text-end">
                        <img src="${pago.imagen}"
                            width="60" height="60">
                    </div>
                </div>

                <div class="row">
                    <div class="col-12 ">
                        <button class="btn w-100 btn-danger mt-2 btn-sm js-eliminar-metodo-pago">
                            <i class="bi bi-trash"></i>
                        </button>

                        </div>
                        </div> 
                    
            </div>
        </div>
            `;
      },

      pedido: function (pedido) {
        return `
            <div class="row mb-3 js-item-pedidos">
            <span class="text-start text-dark   col-6 ">
             ${pedido.nombre}
            </span>
            <span class="text-end  text-dark   col-6">
            S/.${pedido.precio * pedido.cantidad}
            </span>
        </div>`;
      },
    },

    getImage: function (name) {
      let arrayImage = [
        "efectivo",
        "plin",
        "interbank",
        "scotiabank",
        "bbva",
        "yape",
        "bcp",
        "paypal",
        "fisico",
      ];
      let image = "";
      const nameImage = name.toLowerCase().trim();
      const regex = new RegExp(nameImage, "gi");

      arrayImage.forEach((item) => {
        if (regex.test(item)) {
          image = `/images/metodos-pago/${nameImage}.png`;
        }
      });

      return image;
    },
  };
};
