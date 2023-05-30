package com.proyecto.entity;

import java.util.*;
import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;

@Entity
@Table(name = "APERTURA")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Apertura {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  @Column(name = "FECHA_APERTURA")
  private Date fechaApertura;

  @Column(name = "FECHA_CIERRE")
  private Date fechaCierre;

  @Column(name = "VENTA_TOTAL_DIA")
  private double ventaTotalDia;

  @ManyToOne
  @JoinColumn(name = "EMPLEADO_ID")
  private Empleado empleado;

  @ManyToOne
  @JoinColumn(name = "CAJA_ID")
  private Caja caja;

  @OneToMany(mappedBy = "apertura")
  @JsonIgnore
  private List<Comprobante> listaComprobante;

  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public Date getFechaApertura() {
    return fechaApertura;
  }

  public void setFechaApertura(Date fechaApertura) {
    this.fechaApertura = fechaApertura;
  }

  public Date getFechaCierre() {
    return fechaCierre;
  }

  public void setFechaCierre(Date fechaCierre) {
    this.fechaCierre = fechaCierre;
  }

  public double getVentaTotalDia() {
    return ventaTotalDia;
  }

  public void setVentaTotalDia(double ventaTotalDia) {
    this.ventaTotalDia = ventaTotalDia;
  }

  public Empleado getEmpleado() {
    return empleado;
  }

  public void setEmpleado(Empleado empleado) {
    this.empleado = empleado;
  }

  public Caja getCaja() {
    return caja;
  }

  public void setCaja(Caja caja) {
    this.caja = caja;
  }

  public List<Comprobante> getListaComprobante() {
    return listaComprobante;
  }

  public void setListaComprobante(List<Comprobante> listaComprobante) {
    this.listaComprobante = listaComprobante;
  }
}
