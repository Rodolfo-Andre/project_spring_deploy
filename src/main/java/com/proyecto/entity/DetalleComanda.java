package com.proyecto.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Entity
@Table(name = "DETALLE_COMANDA")
public class DetalleComanda {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  @Column(name = "CANTIDAD_PEDIDO")
  private int cantidadPedido;

  @Column(name = "PRECIO_UNITARIO")
  private double precioUnitario;

  @Column(name = "Observacion")
  private String observacion;

  @ManyToOne
  @JoinColumn(name = "PLATO_ID")
  private Plato plato;

  @ManyToOne
  @JsonIgnore
  @JoinColumn(name = "COMANDA_ID")
  private Comanda comanda;

  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public int getCantidadPedido() {
    return cantidadPedido;
  }

  public void setCantidadPedido(int cantidadPedido) {
    this.cantidadPedido = cantidadPedido;
  }

  public double getPrecioUnitario() {
    return precioUnitario;
  }

  public void setPrecioUnitario(double precioUnitario) {
    this.precioUnitario = precioUnitario;
  }

  public Plato getPlato() {
    return plato;
  }

  public void setPlato(Plato plato) {
    this.plato = plato;
  }

  public Comanda getComanda() {
    return comanda;
  }

  public void setComanda(Comanda comanda) {
    this.comanda = comanda;
  }
}
