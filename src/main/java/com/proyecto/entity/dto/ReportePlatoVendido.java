package com.proyecto.entity.dto;

public class ReportePlatoVendido {
  private String codplato;
  private String nomPlato;
  private String nomCat;
  private double totalsale;
  private int cantPedido;

  public String getCodplato() {
    return codplato;
  }

  public void setCodplato(String codplato) {
    this.codplato = codplato;
  }

  public String getNomPlato() {
    return nomPlato;
  }

  public void setNomPlato(String nomPlato) {
    this.nomPlato = nomPlato;
  }

  public String getNomCat() {
    return nomCat;
  }

  public void setNomCat(String nomCat) {
    this.nomCat = nomCat;
  }

  public double getTotalsale() {
    return totalsale;
  }

  public void setTotalsale(double totalsale) {
    this.totalsale = totalsale;
  }

  public int getCantPedido() {
    return cantPedido;
  }

  public void setCantPedido(int cantPedido) {
    this.cantPedido = cantPedido;
  }
}
