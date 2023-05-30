package com.proyecto.entity;

import jakarta.persistence.*;
import java.util.List;
import com.fasterxml.jackson.annotation.*;

@Entity
@Table(name = "COMANDA")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Comanda {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  @Column(name = "CANTIDAD_ASIENTOS")
  private int cantidadAsientos;

  @Column(name = "PRECIO_TOTAL")
  private double precioTotal;

  @Column(name = "FECHA_EMISION")
  private String fechaEmision;

  @ManyToOne
  @JoinColumn(name = "MESA_ID")
  private Mesa mesa;

  @ManyToOne
  @JoinColumn(name = "ESTADO_COMANDA_ID")
  private EstadoComanda estadoComanda;

  @ManyToOne
  @JoinColumn(name = "EMPLEADO_ID")
  private Empleado empleado;

  @OneToMany(mappedBy = "comanda")
  private List<DetalleComanda> listaDetalleComanda;

  @OneToOne(mappedBy = "comanda")
  private Comprobante comprobante;

  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public int getCantidadAsientos() {
    return cantidadAsientos;
  }

  public void setCantidadAsientos(int cantidadAsientos) {
    this.cantidadAsientos = cantidadAsientos;
  }

  public double getPrecioTotal() {
    return precioTotal;
  }

  public void setPrecioTotal(double precioTotal) {
    this.precioTotal = precioTotal;
  }

  public Mesa getMesa() {
    return mesa;
  }

  public void setMesa(Mesa mesa) {
    this.mesa = mesa;
  }

  public EstadoComanda getEstadoComanda() {
    return estadoComanda;
  }

  public void setEstadoComanda(EstadoComanda estadoComanda) {
    this.estadoComanda = estadoComanda;
  }

  public Empleado getEmpleado() {
    return empleado;
  }

  public void setEmpleado(Empleado empleado) {
    this.empleado = empleado;
  }

  public List<DetalleComanda> getListaDetalleComanda() {
    return listaDetalleComanda;
  }

  public void setListaDetalleComanda(List<DetalleComanda> listaDetalleComanda) {
    this.listaDetalleComanda = listaDetalleComanda;
  }

  public Comprobante getComprobante() {
    return comprobante;
  }

  public void setComprobante(Comprobante comprobante) {
    this.comprobante = comprobante;
  }

  public String getFechaEmision() {
    return fechaEmision;
  }

  public void setFechaEmision(String fechaEmision) {
    this.fechaEmision = fechaEmision;
  }
}