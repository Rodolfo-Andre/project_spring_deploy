package com.proyecto.entity;

import jakarta.persistence.*;
import java.util.*;

@Entity
@Table(name = "CAJA")
public class Caja {
  @Id
  private String id;

  @ManyToOne
  @JoinColumn(name = "ESTABLECIMIENTO_ID")
  private Establecimiento establecimiento;

  @OneToMany(mappedBy = "caja")
  private List<Apertura> listaAperuta;

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public Establecimiento getEstablecimiento() {
    return establecimiento;
  }

  public void setEstablecimiento(Establecimiento establecimiento) {
    this.establecimiento = establecimiento;
  }

  public List<Apertura> getListaAperuta() {
    return listaAperuta;
  }

  public void setListaAperuta(List<Apertura> listaAperuta) {
    this.listaAperuta = listaAperuta;
  }   
}
