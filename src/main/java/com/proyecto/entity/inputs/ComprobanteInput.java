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
    public double subTotal;
    public double igv;
    public String idCaja;
}