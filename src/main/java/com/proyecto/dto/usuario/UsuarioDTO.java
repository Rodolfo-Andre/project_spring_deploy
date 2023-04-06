package com.proyecto.dto.usuario;

import org.springframework.validation.annotation.Validated;
import jakarta.validation.constraints.*;

@Validated
public class UsuarioDTO {
  @Email(message = "El correo no es válido")
  @NotBlank(message = "El correo es obligatorio")
  private String correo;

  public String getCorreo() {
    return correo;
  }

  public void setCorreo(String correo) {
    this.correo = correo;
  }
}
