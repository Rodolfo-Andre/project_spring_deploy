package com.proyecto.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import com.proyecto.entity.EstadoComanda;

public interface EstadoComandaRepository extends JpaRepository<EstadoComanda, Integer> {
}
