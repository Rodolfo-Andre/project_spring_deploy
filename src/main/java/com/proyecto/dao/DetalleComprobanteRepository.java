package com.proyecto.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.proyecto.entity.DetalleComprobante;

public interface DetalleComprobanteRepository extends JpaRepository<DetalleComprobante, Integer> {

}
