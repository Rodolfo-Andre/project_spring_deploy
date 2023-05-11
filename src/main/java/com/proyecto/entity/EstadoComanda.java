package com.proyecto.entity;

import java.util.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "ESTADO_COMANDA")
public class EstadoComanda {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  private String estado;

  public EstadoComanda() {
  }

  public EstadoComanda(String estado) {
    this.estado = estado;
  }

  @OneToMany(mappedBy = "estadoComanda")
  @JsonIgnore
  private List<Comanda> listaComanda;

  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
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