package com.proyecto.db;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import com.proyecto.dao.*;
import com.proyecto.entity.*;

@Component
public class DatabaseLoader implements CommandLineRunner {
  private final UsuarioRepository usuarioRepository;
  private final CargoRepository cargoRepository;

  @Autowired
  public DatabaseLoader(UsuarioRepository usuarioRepository, CargoRepository cargoRepository) {
    this.usuarioRepository = usuarioRepository;
    this.cargoRepository = cargoRepository;
  }

  @Override
  public void run(String... args) throws Exception {
    BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    if (this.cargoRepository.count() == 0) {
      this.cargoRepository.save(new Cargo("Administrador"));
    }

    if (this.usuarioRepository.count() == 0) {
      Cargo cargo = this.cargoRepository.findByNombre("Administrador");

      Usuario usuario = new Usuario();

      usuario.setCorreo("admin@admin.com");
      usuario.setContrasena(passwordEncoder.encode("admin"));

      Empleado empleado = new Empleado();
      empleado.setNombre("Admin");
      empleado.setApellido("Admin");
      empleado.setDni("77777777");
      empleado.setTelefono("999999999");
      empleado.setUsuario(usuario);
      empleado.setCargo(cargo);

      usuario.setEmpleado(empleado);

      this.usuarioRepository.save(usuario);
    }
  }
}
