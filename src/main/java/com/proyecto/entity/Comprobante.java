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

  @Column(name = "NOMBRE_CLIENTE")
  private String nombreCliente;

  @Column(name = "FECHA_EMISION")
  private Date fechaEmision;

  @Column(name = "PRECIO_TOTAL_PEDIDO")
  private double precioTotalPedido;

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
  @JoinColumn(name = "APERTURA_ID")
  private Apertura apertura;

  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public String getNombreCliente() {
    return nombreCliente;
  }

  public void setNombreCliente(String nombreCliente) {
    this.nombreCliente = nombreCliente;
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

  public Apertura getApertura() {
    return apertura;
  }

  public void setApertura(Apertura apertura) {
    this.apertura = apertura;
  }
}
