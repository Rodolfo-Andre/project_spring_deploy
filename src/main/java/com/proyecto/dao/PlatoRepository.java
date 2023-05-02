package com.proyecto.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.proyecto.entity.Plato;

public interface PlatoRepository extends JpaRepository<Plato, String> {
}
