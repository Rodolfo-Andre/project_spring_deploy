package com.proyecto.entity;

import java.util.*;
import jakarta.persistence.*;

@Entity
@Table(name = "TIPO_COMPROBANTE")
public class TipoComprobante {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  private String tipo;

  @OneToMany(mappedBy = "tipoComprobante")
  private List<Comprobante> listaComprobante;

  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public String getTipo() {
    return tipo;
  }

  public void setTipo(String tipo) {
    this.tipo = tipo;
  }

  public List<Comprobante> getListaComprobante() {
    return listaComprobante;
  }

  public void setListaComprobante(List<Comprobante> listaComprobante) {
    this.listaComprobante = listaComprobante;
  }  
}
