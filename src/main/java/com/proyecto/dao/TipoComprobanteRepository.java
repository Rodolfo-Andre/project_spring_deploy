package com.proyecto.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import com.proyecto.entity.TipoComprobante;

public interface TipoComprobanteRepository extends JpaRepository<TipoComprobante, Integer> {
}
