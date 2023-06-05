package com.proyecto.controller;

import com.proyecto.entity.Caja;
import com.proyecto.entity.Cliente;
import com.proyecto.entity.Comanda;
import com.proyecto.entity.Comprobante;
import com.proyecto.entity.DetalleComprobante;
import com.proyecto.entity.Establecimiento;
import com.proyecto.entity.MetodoPago;
import com.proyecto.entity.TipoComprobante;
import com.proyecto.entity.inputs.ComprobanteInput;

import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.proyecto.service.ClienteService;
import com.proyecto.service.ComandaService;
import com.proyecto.service.ComprobanteService;
import com.proyecto.service.EmpleadoService;
import com.proyecto.service.TipoComprobanteService;

@Controller
@RequestMapping(value = "/configuracion/comprobante")
public class ComprobanteController {

    @Autowired
    TipoComprobanteService tipoComprobanteService;

    @Autowired
    ClienteService clienteService;

    @Autowired
    ComandaService comandaService;

    @Autowired
    EmpleadoService empleadoService;

    @Autowired
    ComprobanteService comprobanteService;

    @GetMapping(value = "/obtener-tipo-comprobante")
    @ResponseBody
    public List<TipoComprobante> getDetallesById() {
        List<TipoComprobante> detalles = tipoComprobanteService.obtenerTodo();
        return detalles;

    }

    @GetMapping(value = "/obtener-cliente/{dni}")
    @ResponseBody
    public Cliente getClienteByDni(
            @PathVariable("dni") String dni

    ) {
        return clienteService.obtenerPorDni(dni);
    }

    @PostMapping(value = "/registrar")
    public ResponseEntity<Map<String, String>> Guardar(
            @RequestBody ComprobanteInput input) {

        Comanda comanda = comandaService.obtenerPorId(input.idComanda);

        if (comanda == null) {

            String mensaje = "Error no existe comanda";
            String status = "error";
            return ResponseEntity.ok().body(Map.of("mensaje", mensaje, "status", status));
        }
        Cliente cliente;
        cliente = clienteService.obtenerPorDni(input.cliente.getDni());

        if (cliente == null) {

            cliente = new Cliente();

            cliente.setDni(input.cliente.getDni());
            cliente.setNombre(input.cliente.getNombre());
            cliente.setApellido(input.cliente.getApellido());

        }

        Comprobante comprobante = new Comprobante();
        Date fecha = new Date();

        comprobante.setCliente(cliente);
        comprobante.setComanda(comanda);
        comprobante.setDescuento(input.descuento);
        comprobante.setPrecioTotalPedido(input.precioTotalPedido);
        comprobante.setTipoComprobante(tipoComprobanteService.obtenerPorId(input.idTipoComprobante));

        comprobante.setEmpleado(empleadoService.findEmpleadoByIdUsario(input.idEmpleado));
        Establecimiento establecimiento = new Establecimiento();
        establecimiento.setId("ES-01");
        comprobante.setEstablecimiento(establecimiento);
        comprobante.setFechaEmision(fecha);

        Caja caja = new Caja();
        caja.setId(input.idCaja);
        comprobante.setCaja(caja);

        comprobanteService.registrar(comprobante);

        Comanda comandaUpdate = comandaService.obtenerPorId(input.idComanda);
        // comandaUpdate.setEstado("PAGADO");
        comandaService.actualizar(comandaUpdate);

        for (int i = 0; i < input.listaPagos.size(); i++) {
            DetalleComprobante detalleComprobante = new DetalleComprobante();
            detalleComprobante.setComprobante(comprobante);
            detalleComprobante.setMontoPago(input.listaPagos.get(i).monto);

            MetodoPago metodoPago = new MetodoPago();
            metodoPago.setId(input.listaPagos.get(i).idTipoPago);

            detalleComprobante.setMetodoPago(metodoPago);

            comprobanteService.registrarDetalle(detalleComprobante);

        }

        String mensaje = "Se registro correctamente";
        String status = "success";

        return ResponseEntity.ok().body(Map.of("mensaje", mensaje, "status", status));

    }

}