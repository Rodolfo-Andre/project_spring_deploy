package com.proyecto.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import com.proyecto.entity.CategoriaPlato;

public interface CategoriaPlatoRepository extends JpaRepository<CategoriaPlato, String> {

}
