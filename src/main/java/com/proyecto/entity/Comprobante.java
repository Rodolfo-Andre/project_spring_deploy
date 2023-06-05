package com.proyecto.entity;

import java.util.*;
import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;

@Entity
@Table(name = "COMPROBANTE")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Comprobante {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  @Column(name = "FECHA_EMISION")
  private Date fechaEmision;

  @Column(name = "PRECIO_TOTAL_PEDIDO")
  private double precioTotalPedido;

  @Column(name = "IGV_TOTAL")
  private double igv;

  @Column(name = "DESCUENTO_TOTAL")
  private double descuento;

  @ManyToOne
  @JoinColumn(name = "CLIENTE_ID")
  private Cliente cliente;

  @ManyToOne
  @JoinColumn(name = "ESTABLECIMIENTO_ID")
  private Establecimiento establecimiento;

  @ManyToOne
  @JoinColumn(name = "TIPO_COMPROBANTE_ID")
  private TipoComprobante tipoComprobante;

  @ManyToOne
  @JoinColumn(name = "EMPLEADO_ID")
  private Empleado empleado;

  @OneToOne
  @JoinColumn(name = "COMANDA_ID")
  private Comanda comanda;

  @ManyToOne
  @JoinColumn(name = "CAJA_ID")
  private Caja caja;

  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public Date getFechaEmision() {
    return fechaEmision;
  }

  public void setFechaEmision(Date fechaEmision) {
    this.fechaEmision = fechaEmision;
  }

  public double getPrecioTotalPedido() {
    return precioTotalPedido;
  }

  public void setPrecioTotalPedido(double precioTotalPedido) {
    this.precioTotalPedido = precioTotalPedido;
  }

  public double getIgv() {
    return igv;
  }

  public void setIgv(double igv) {
    this.igv = igv;
  }


  public double getDescuento() {
    return descuento;
  }

  public void setDescuento(double descuento) {
    this.descuento = descuento;
  }

  public Cliente getCliente() {
    return cliente;
  }

  public void setCliente(Cliente cliente) {
    this.cliente = cliente;
  }

  public Establecimiento getEstablecimiento() {
    return establecimiento;
  }

  public void setEstablecimiento(Establecimiento establecimiento) {
    this.establecimiento = establecimiento;
  }

  public TipoComprobante getTipoComprobante() {
    return tipoComprobante;
  }

  public void setTipoComprobante(TipoComprobante tipoComprobante) {
    this.tipoComprobante = tipoComprobante;
  }

  public Empleado getEmpleado() {
    return empleado;
  }

  public void setEmpleado(Empleado empleado) {
    this.empleado = empleado;
  }

  public Comanda getComanda() {
    return comanda;
  }

  public void setComanda(Comanda comanda) {
    this.comanda = comanda;
  }

  public Caja getCaja() {
    return caja;
  }

  public void setCaja(Caja caja) {
    this.caja = caja;
  }
}
