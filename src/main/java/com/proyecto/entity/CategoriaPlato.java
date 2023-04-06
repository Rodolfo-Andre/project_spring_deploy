package com.proyecto.entity;

import jakarta.persistence.*;
import java.util.*;

@Entity
@Table(name = "CATEGORIA_PLATO")
public class CategoriaPlato {
  @Id
  private String id;

  private String nombre;

  @OneToMany(mappedBy = "categoriaPlato")
  private List<Plato> listaPlato;

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getNombre() {
    return nombre;
  }

  public void setNombre(String nombre) {
    this.nombre = nombre;
  }

  public List<Plato> getListaPlato() {
    return listaPlato;
  }

  public void setListaPlato(List<Plato> listaPlato) {
    this.listaPlato = listaPlato;
  }  
}
