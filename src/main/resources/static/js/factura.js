export const ViewCoreFactura = function () {
  this.Core = {
    contextUrl: "/configuracion/",
    api: {
      obtenerMetodosPago: "metodo-pago/obtener",
    },
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
      this.estadoUsuario = $("#txt-estado-usuario");

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
      this.listMetodoPago = [];
      this.descuentoSave = 0;
      this.dniSave = 0;
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
        this.agregarMetodoNuevoPago();
      });

      // this.numeroDocumento.on("keyup", async (ev) => {
      //   const { value } = ev.target;
      //   if (value.length < 8) {
      //     me.addError(
      //       "El número de documento no puede tener menos de 8 dígitos"
      //     );
      //     return;
      //   }

      //   if (value.length == 8) {
      //     me.clearErrors();
      //     await me.findCliente();
      //   }
      // });

      $("#btn-buscar-cliente").on("click", async () => {
        await me.findCliente();
      });

      this.numeroDocumento.on("input", function () {
        var inputValue = $(this).val();
        if (inputValue.length > 8) {
          $(this).val(inputValue.slice(0, 8));
        }

        if (inputValue.length == 8) {
          $("#btn-buscar-cliente").prop("disabled", false);
        } else {
          $("#btn-buscar-cliente").prop("disabled", true);
        }
      });

      this.btnDescuento.on("click", () => {
        const val = me.convertirNumero(this.descuento.val());
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

        if (this.pago >= this.total) {
          this.addError(
            "No se puede aplicar descuento, ya se ha pagado el total"
          );
          return;
        }

        if(val == this.total){
          this.addError(
            "No se puede aplicar descuento, ya se ha pagado el total"
          );
          return;
        }


        if (this.descuentoSave == this.total) {
          this.addError(
            "No se puede aplicar descuento, ya se ha pagado el total"
          );
          return;
        }


        if(this.descuentoSave >  this.total){
          this.addError("No se puede aplicar descuento, ya se ha pagado el total");
          return;
        }  

        if(this.descuentoSave > this.faltante){
          this.addError("No se puede aplicar descuento, ya se ha pagado el total");
          return;
        }
        const descuentoConTotal = this.descuentoSave + val;

        if (descuentoConTotal > this.total) {
          this.addError("El descuento no puede ser mayor al total");
          return;
        } 

        if (this.descuentoSave == val) {
          return;
        }

        const rendonderDescuento = Math.round(val * 100) / 100;
        const rendondearFaltante = Math.round(this.faltante * 100) / 100;

        if (rendonderDescuento > rendondearFaltante) {
          this.addError("El descuento no puede ser mayor al faltante");
          return;
        }


        this.clearErrors();
        
        this.descuentoSave = val;
        this.total = this.total - val;
        this.faltante = this.total - this.pago;
        this.txtTotal.text(this.total.toFixed(2));
        this.faltantetxt.text(this.faltante.toFixed(2));
        this.txtDescuento.text(val.toFixed(2));
      });

      this.monto.on("input", function () {
        var inputValue = $(this).val();
        if (inputValue.length > 10000) {
          $(this).val(inputValue.slice(0, 3));
        }

        if (inputValue.length == 0) {
          $(this).val("0");
        }

        if (inputValue.length < 0) {
          $(this).val("0");
        }
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

        if (this.cboCaja.val() == "" || this.cboCaja.val() == "default" || this.cboCaja.val() == null || this.cboCaja.val() == undefined) {
          this.addError("Seleccione una caja");
          return;
        }

        if (this.cboTipoFactura.val() == "") {
          this.addError("Seleccione un tipo de factura");
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
        this.cboPago.append(`<option value="default">--Seleccione--</option>`);
        this.listMetodoPago = data;
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

        $("#cbo-caja").append(
          `<option value="default">--Seleccione--</option>`
        );
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

      this.nuevoCalcularTotal();
    },
    findCliente: async function () {
      const numeroDocumento = this.numeroDocumento.val();

      const regex = /^\d+$/;

      if (!regex.test(numeroDocumento)) {
        this.addError("Ingrese un número de documento válido");
        return;
      }

      this.clearErrors();

      this.dniSave = numeroDocumento;

      const url =
        this.contextUrl + "comprobante/obtener-cliente/" + numeroDocumento;

      try {
        const response = await fetch(url);

        const data = await response.json();

        this.nombreCliente.val(data.nombre);
        this.apellidoCliente.val(data.apellido);
      } catch (error) {
        console.log(error);
        this.nombreCliente.val("").attr("disabled", false);
        this.apellidoCliente.val("").attr("disabled", false);
      } finally {
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

    agregarMetodoNuevoPago: function () {

      const regex = /^[0-9,.]+$/;

      const idMetodoPago = this.cboPago.val();
      const monto = this.monto.val().trim();
      const montoConvert = this.convertirNumero(this.monto.val());

      if (this.cboPago.val() == "default") {
        this.addError("Seleccione un método de pago");
        return;
      }
      const  rendondearMonto = Math.round(monto * 100) / 100;
      const rendondearFaltante = Math.round(this.faltante * 100) / 100;
      const existeMetodoPago = this.listMetodoPago.find(
        (pago) => pago.id === parseInt(idMetodoPago)
      );

      if (existeMetodoPago == undefined) {
        this.addError("Seleccione un método de pago");
        return;
      }
      if (
        monto == 0 ||
        monto == "" ||
        monto == null ||
        monto == undefined ||
        monto == NaN  ||
        !regex.test(monto) 
      ) {
        this.addError("El monto no puede ser 0");
        return;
      }

      if (monto < 0) {
        this.addError("El monto no puede ser negativo");
        return;
      }

      if (monto > this.total) {
        this.addError("El montó supera el total");
        return;
      }

      if(rendondearMonto > rendondearFaltante){
        this.addError("El montó supera el faltante");
        return;
      }
      


      const existe = this.listaPagos.find((pago) => pago.id === idMetodoPago);
      //si existe el metodo de pago en la lista de pagos se actualiza el monto
      if (existe) {
        const montoExitente= existe.monto + montoConvert;

        const rendondearTotal = Math.round(this.total * 100) / 100;
        const rendondearMontoExitente = Math.round(montoExitente * 100) / 100;


        if (rendondearMontoExitente > rendondearTotal) {
          this.addError("El montó supera el total");
          return;
        
      }


        if (rendondearMontoExitente < 0) {
          this.addError("El monto no puede ser negativo");
          return; // Salir del `if` y del contexto actual
        }


        existe.monto = montoExitente;
        const montoTotal = this.listaPagos.reduce((a, b) => a + b.monto, 0);
        const rendonderMontoTotal = Math.round(montoTotal * 100) / 100;
        
        if (rendonderMontoTotal > rendondearTotal) {
          this.addError("El montó supera el total");
          existe.monto = existe.monto - montoConvert;
          return;
        }


        $("#mt-" + idMetodoPago).text(existe.monto.toFixed(2));


        this.pago = montoTotal;

        this.txtpago.text(this.pago.toFixed(2));

        this.faltante = this.total - this.pago;

        this.faltantetxt.text(this.faltante.toFixed(2));

        this.monto.val("");
      } else {
        const pago = {
          key: this.generateKey(),
          id: idMetodoPago,
          monto: montoConvert,
          tituloPago: existeMetodoPago.metodo,
          imagen: this.getImage(existeMetodoPago.metodo),
        };

        this.listaPagos.push(pago);

        const montoTotal = this.listaPagos.reduce((a, b) => a + b.monto, 0);

        this.pago = montoTotal;
        
        this.txtpago.text(this.pago.toFixed(2));

        this.faltante = this.total - this.pago;

        this.faltantetxt.text(this.faltante.toFixed(2));

        this.containerCardsPago.append(this.templates.cardPago(pago));

        this.cboPago.val("default");
        this.containerCardsPago.css("display", "block");
        this.monto.val("");

         $(`.js-eliminar-metodo-pago-${pago.key}`).on("click", () => {
          this.eliminarMetodoPago(pago.key);
        });
      }

      this.clearErrors();
    },

    nuevoCalcularTotal: function () {
      this.total = 0;
      this.faltante = 0;
      this.pago = 0;
      this.listaPagos = [];
      this.containerCardsPago.empty();
      this.containerCardsPago.css("display", "none");
      this.txtpago.text("0.00");
      this.faltantetxt.text("0.00");
      this.monto.val("");
      this.clearErrors();

      let subTotal = 0;
      let total = 0;

      let igv = 0;

      subTotal = this.listaPedidos.reduce(
        (a, b) => a + b.cantidad * b.precio,
        0
      );

      igv = subTotal * 0.18;

      total = subTotal + igv;

      this.total = total;
      this.faltante = this.total;
      this.subTotalVal = this.convertirNumero(subTotal.toFixed(2));
      this.txtpago.text(this.pago.toFixed(2));
      this.subtotal.text(subTotal.toFixed(2));
      this.txtDescuento.text(this.descuentoSave.toFixed(2));
      this.faltantetxt.text(this.faltante.toFixed(2));
      this.txtTotal.text(this.total.toFixed(2));
      this.igv.text(igv.toFixed(2));
      this.igvValue = this.convertirNumero(igv.toFixed(2));

    },

    eliminarMetodoPago: function (id) {
        const pago = this.listaPagos.find((pago) => pago.key === id);
        if(pago == undefined || pago == null || pago == "" || pago == NaN){
          return;
        }

      $(`#${pago.key}`).remove();
      this.listaPagos = this.listaPagos.filter((pago) => pago.key !== id);

      this.pago = this.listaPagos.reduce((a, b) => a + b.monto, 0);

      this.faltante = this.total - this.pago;

      this.faltantetxt.text(this.faltante.toFixed(2));

      this.txtpago.text(this.pago.toFixed(2));


      if(this.listaPagos.length == 0){
        this.containerCardsPago.css("display", "none");
      }
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
      let me = this;
      const newListaPagos = this.listaPagos.map((pago) => {
        return {
          idTipoPago: pago.id,
          monto: pago.monto,
        };
      });

      this.btnFacturar.attr("disabled", true);
      const url = this.contextUrl + "comprobante/registrar";
      console.log(this.dniSave);
      
      if (this.dniSave == undefined || this.dniSave == null || this.dniSave == "") {
          this.dniSave = "";
      }

      if(this.dniSave.length != 8){
        this.dniSave = "";
      }

      if (this.dniSave.length ==8) {

        const nombre =this.nombreCliente.val()
        const apellido = this.apellidoCliente.val();
            console.log(nombre);
            console.log(apellido);
            

        if (nombre == "" || nombre == null || nombre == undefined ) {
          this.addError("Ingrese el nombre del cliente");
          this.btnFacturar.attr("disabled", false);
          return;
        }

        if (apellido == "" || apellido == null || apellido == undefined) {
          this.addError("Ingrese el apellido del cliente");
          this.btnFacturar.attr("disabled", false);
          return;
        }

      }

      const data = {
        precioTotalPedido: this.total,
        idTipoComprobante: this.cboTipoFactura.val(),
        idComanda: $("#txt-numero-comanda").val(),
        idEmpleado: $("#txt-id-usuario").val(),
        cliente: {
          nombre: this.nombreCliente.val(),
          apellido: this.apellidoCliente.val(),
          dni: this.dniSave,
        },
        listaPagos: newListaPagos,
        descuento: this.descuentoSave,
        idCaja: this.cboCaja.val(),
        igv: this.igvValue,
        subTotal: this.subTotalVal,
      };
      

      $.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify(data),
        contentType: "application/json",
      })
        .done(() => {
          Swal.fire({
            title: "Comprobante registrado",
            text: "El comprobante se registró correctamente",
            icon: "success",
            confirmButtonText: "Aceptar",
          }).then((result) => {
            fetch("/usuario")
              .then((response) => response.json())
              .then(
                ({
                  empleado: {
                    cargo: { nombre },
                  },
                }) => {
                  const object =
                    nombre === "ROLE_CAJERO" ? "comprobante" : "comanda";
                  const url = this.contextUrl + object;

                  if (result.isConfirmed) {
                    window.location.href = url;
                  }
                }
              );
          });
        })
        .fail(() => {
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
            id="${pago.key}"
            class="card w-100 mb-2">
            <div class="card-body">
                <h5 class="card-title text-center">
                    ${pago.tituloPago}
                </h5>
                <div class="row d-flex align-items-center">
                    <div class="col-6 " id="">
                        <p class="card-text ">Monto: S/.<span class="js-monto" id="mt-${pago.id}" >${pago.monto.toFixed(
                          2
                        )}</span></p>
                    </div>
                    <div class="col-6 text-end">
                        <img src="${pago.imagen}"
                            width="60" height="60">
                    </div>
                </div>

                <div class="row">
                    <div class="col-12 ">
                        <button class="btn w-100 btn-danger mt-2 btn-sm js-eliminar-metodo-pago-${pago.key}">
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
      ];
      let image = "";
      const nameImage = name.toLowerCase().trim();

      arrayImage.forEach((item) => {
        const regex = new RegExp(item, "gi");

        if (regex.test(nameImage)) {
          image = `/images/metodos-pago/${item}.png`;
        } else {
          image = `/images/metodos-pago/efectivo.png`;
        }
      });

      return image;
    },

    generateKey: function () {
      return Math.random().toString(36).substr(2, 9);
    },

    convertirNumero: function (numero) {
      const numeroConPunto = numero.replace(/,/g, ".");
      const convertirNumero = parseFloat(numeroConPunto).toFixed(2);
      const valorNumerico = parseFloat(convertirNumero);

      return valorNumerico;
    },
  };
};
