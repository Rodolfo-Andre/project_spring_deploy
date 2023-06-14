package com.proyecto.entity.dto;

public class ReporteVentas {
  private String fechaEmision;
  private double qRecaudada;
  private int qComprobante;
  private int qPlatos;
  private String platoMasVendido;

  public String getFechaEmision() {
    return fechaEmision;
  }

  public void setFechaEmision(String fechaEmision) {
    this.fechaEmision = fechaEmision;
  }

  public double getqRecaudada() {
    return qRecaudada;
  }

  public void setqRecaudada(double qRecaudada) {
    this.qRecaudada = qRecaudada;
  }

  public int getqComprobante() {
    return qComprobante;
  }

  public void setqComprobante(int qComprobante) {
    this.qComprobante = qComprobante;
  }

  public int getqPlatos() {
    return qPlatos;
  }

  public void setqPlatos(int qPlatos) {
    this.qPlatos = qPlatos;
  }

  public String getPlatoMasVendido() {
    return platoMasVendido;
  }

  public void setPlatoMasVendido(String platoMasVendido) {
    this.platoMasVendido = platoMasVendido;
  }
}
