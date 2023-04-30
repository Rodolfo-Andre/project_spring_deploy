package com.proyecto.entity;

import java.util.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "MESA")
public class Mesa {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  @Column(name = "CANTIDAD_ASIENTOS")
  private int cantidadAsientos;

  @Column(name = "ESTADO")
  private String estado;

  @OneToMany(mappedBy = "mesa")
  @JsonIgnore
  private List<Comanda> listaComanda;

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

  public String getEstado() {
    return estado;
  }

  public void setEstado(String estado) {
    this.estado = estado;
  }

  public List<Comanda> getListaComanda() {
    return listaComanda;
  }

  public void setListaComanda(List<Comanda> listaComanda) {
    this.listaComanda = listaComanda;
  }
}