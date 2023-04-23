package com.proyecto.dto.usuario;

import org.springframework.validation.annotation.Validated;
import jakarta.validation.constraints.*;

@Validated
public class RegistroUsuarioDTO extends UsuarioDTO {
  @NotEmpty(message = "La contraseña no debe de estar vacía")
  private String contrasena;

  public String getContrasena() {
    return contrasena;
  }

  public void setContrasena(String contrasena) {
    this.contrasena = contrasena;
  }
}
