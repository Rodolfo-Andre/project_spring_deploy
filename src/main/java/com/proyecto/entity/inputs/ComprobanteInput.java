package com.proyecto.entity.inputs;

import java.util.List;

import com.proyecto.entity.Cliente;

public class ComprobanteInput {

    public double precioTotalPedido;
    public int idTipoComprobante;
    public int idComanda;
    public int idEmpleado;
    public Cliente cliente;
    public List<PagoInput> listaPagos;
    public double descuento;
    public String idCaja;
}
// precioTotalPedido: this.total,
// idTipoComprobante: this.cboTipoFactura.val(),
// idComanda: $("#txt-numero-comanda").val(),
// idEmpleado: $("#txt-id-usuario").val(),
// cliente: {
//   nombre: this.nombreCliente.val(),
//   apellido: this.apellidoCliente.val(),
//   dni: this.numeroDocumento.val(),
// },
// listaPagos: newListaPagos,
// descuento: this.descuento.val(),
// idCaja: this.cboCaja.val(),