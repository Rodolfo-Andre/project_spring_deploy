package com.proyecto;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import com.proyecto.dao.*;
import com.proyecto.entity.*;

@SpringBootTest
public class UsuarioTests {
  @Autowired()
  UsuarioRepository usuarioRepository;

  @Autowired
  EmpleadoRepository empleadoRepository;

  // @Test
  void crearUsuario() {
    Empleado empleado = new Empleado();
    Usuario usuario = new Usuario();

    usuario.setContrasena("admin");
    usuario.setCorreo("admin@admin.com");

    empleado.setUsuario(usuario);
    usuario.setEmpleado(empleado);

    empleadoRepository.save(empleado);
  }

  // @Test
  void verificarCorreo() {
    String correoEntrada = "admin@admin.com";

    Usuario usuario = usuarioRepository.findByCorreo(correoEntrada);
    assertNotNull(usuario, "Usuario no debe ser nulo");

    String correo = usuario.getCorreo();

    assertNotNull(correo, "Correo no debe ser nulo");
    assertEquals("admin@admin.com", correo, "No son iguales");
  }

  // @Test
  void eliminarUsuario() {
    empleadoRepository.delete(empleadoRepository.findById(1).orElse(null));
  }

}
