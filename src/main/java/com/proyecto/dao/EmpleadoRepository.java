package com.proyecto.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.proyecto.entity.Empleado;

public interface EmpleadoRepository extends JpaRepository<Empleado, Integer> {
  @Query("SELECT e FROM Empleado e WHERE e.usuario.id = ?1")
  public Empleado findEmpleadoByUsuario(int idUsuario);

  Empleado findByTelefono(String telefono);

  Empleado findByDni(String dni);
}
