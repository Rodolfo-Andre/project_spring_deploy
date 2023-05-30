package com.proyecto.entity;

public class CheckStatus {
  private String status;
  private String mensaje;

  public static String StatusError = "error";
  public static String StatusSuccess = "success";

  public CheckStatus(String status, String mensaje) {
    this.status = status;
    this.mensaje = mensaje;
  }

  public String getStatus() {
    return status;
  }

  public String getMensaje() {
    return mensaje;
  }

  public void setStatus(String status) {
    this.status = status;
  }

  public void setMensaje(String mensaje) {
    this.mensaje = mensaje;
  }
}
