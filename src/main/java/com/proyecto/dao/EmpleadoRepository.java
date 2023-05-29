package com.proyecto.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import com.proyecto.entity.Empleado;

public interface EmpleadoRepository extends JpaRepository<Empleado, Integer> {
    Empleado findByTelefono(String telefono);

    Empleado findByDni(String dni);

}
