package com.proyecto.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import com.proyecto.entity.Cargo;

public interface CargoRepository extends JpaRepository<Cargo, Integer> {
  Cargo findByNombre(String nombre);
}
