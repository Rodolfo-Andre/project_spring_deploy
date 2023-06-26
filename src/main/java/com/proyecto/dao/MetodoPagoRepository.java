package com.proyecto.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import com.proyecto.entity.MetodoPago;

public interface MetodoPagoRepository extends JpaRepository<MetodoPago, Integer> {
  @Query("SELECT m FROM MetodoPago m WHERE m.metodo = :metodo")
  MetodoPago findByMetodo(String metodo);
}
