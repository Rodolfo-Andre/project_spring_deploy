package com.proyecto.entity;

import java.util.*;
import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;

@Entity
@Table(name = "CARGO")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Cargo {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  private String nombre;

  @OneToMany(mappedBy = "cargo")
  @JsonIgnore
  private List<Empleado> listaEmpleado;

  public Cargo() {
  }

  public Cargo(String nombre) {
    this.nombre = nombre;
  }

  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public String getNombre() {
    return nombre;
  }

  public void setNombre(String nombre) {
    this.nombre = nombre;
  }

  public List<Empleado> getListaEmpleado() {
    return listaEmpleado;
  }

  public void setListaEmpleado(List<Empleado> listaEmpleado) {
    this.listaEmpleado = listaEmpleado;
  }
}
