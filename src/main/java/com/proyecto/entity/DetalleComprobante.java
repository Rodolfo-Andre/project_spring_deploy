package com.proyecto.entity;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;

@Entity
@Table(name = "DETALLE_COMPROBANTE")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class DetalleComprobante {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  @Column(name = "MONTO_PAGO")
  private double montoPago;

  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "COMPROBANTE_ID")
  private Comprobante comprobante;

  @ManyToOne
  @JoinColumn(name = "METODO_PAGO_ID")
  private MetodoPago metodoPago;

  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public double getMontoPago() {
    return montoPago;
  }

  public void setMontoPago(double montoPago) {
    this.montoPago = montoPago;
  }

  public Comprobante getComprobante() {
    return comprobante;
  }

  public void setComprobante(Comprobante comprobante) {
    this.comprobante = comprobante;
  }

  public MetodoPago getMetodoPago() {
    return metodoPago;
  }

  public void setMetodoPago(MetodoPago metodoPago) {
    this.metodoPago = metodoPago;
  }
}
