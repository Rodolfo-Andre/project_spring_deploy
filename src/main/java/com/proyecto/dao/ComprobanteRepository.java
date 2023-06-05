package com.proyecto.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.proyecto.entity.Comprobante;

public interface ComprobanteRepository extends JpaRepository<Comprobante, Integer> {
    
     
}
