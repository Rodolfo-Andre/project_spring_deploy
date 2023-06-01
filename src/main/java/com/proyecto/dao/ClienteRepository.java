package com.proyecto.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import com.proyecto.entity.Cliente;

public interface ClienteRepository extends JpaRepository<Cliente, Integer> {
  Cliente findByDni(String dni);
}
