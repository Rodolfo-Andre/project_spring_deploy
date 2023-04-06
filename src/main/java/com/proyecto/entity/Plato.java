package com.proyecto.entity;

import jakarta.persistence.*;
import java.util.*;

@Entity
@Table(name = "PLATO")
public class Plato {
	@Id
	private String id;
	
	private String nombre;

	private String imagen;

  @Column(name = "PRECIO_PLATO")
	private double precioPlato;

	@OneToMany(mappedBy="plato")
	private List<DetalleComanda> listaDetalleComanda;

  @ManyToOne
  @JoinColumn(name = "CATEGORIA_PLATO_ID")
  private CategoriaPlato categoriaPlato;

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

  public String getImagen() {
    return imagen;
  }

  public void setImagen(String imagen) {
    this.imagen = imagen;
  }

  public double getPrecioPlato() {
    return precioPlato;
  }

  public void setPrecioPlato(double precioPlato) {
    this.precioPlato = precioPlato;
  }

  public List<DetalleComanda> getListaDetalleComanda() {
    return listaDetalleComanda;
  }

  public void setListaDetalleComanda(List<DetalleComanda> listaDetalleComanda) {
    this.listaDetalleComanda = listaDetalleComanda;
  }

  public CategoriaPlato getCategoriaPlato() {
    return categoriaPlato;
  }

  public void setCategoriaPlato(CategoriaPlato categoriaPlato) {
    this.categoriaPlato = categoriaPlato;
  }
}