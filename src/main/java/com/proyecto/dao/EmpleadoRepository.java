package com.proyecto.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import com.proyecto.entity.Empleado;

public interface EmpleadoRepository extends JpaRepository<Empleado, Integer> {
}
