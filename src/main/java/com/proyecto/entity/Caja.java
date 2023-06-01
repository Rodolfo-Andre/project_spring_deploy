package com.proyecto.entity;

import jakarta.persistence.*;
import java.util.*;
import com.fasterxml.jackson.annotation.*;

@Entity
@Table(name = "CAJA")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Caja {
  @Id
  private String id;

  @ManyToOne
  @JoinColumn(name = "ESTABLECIMIENTO_ID")
  private Establecimiento establecimiento;

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

  public static String generarIdCaja(List<Caja> listaCaja) {
    if (listaCaja.isEmpty())
      return "C-001";

    String ultimoId = listaCaja.get(listaCaja.size() - 1).getId();

    int numero = Integer.parseInt(String.join("", ultimoId.split("C-")));

    return "C-" + String.format("%03d", numero + 1);
  }
}
