package com.proyecto.entity;

import org.springframework.stereotype.Component;

@Component
public class GlobalVariables {
  private Establecimiento establecimiento;

  public Establecimiento getEstablecimiento() {
    return establecimiento;
  }

  public void setEstablecimiento(Establecimiento establecimiento) {
    this.establecimiento = establecimiento;
  }
}
