package com.proyecto.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.proyecto.entity.Comprobante;

public interface ComprobanteRepository extends JpaRepository<Comprobante, Integer> {
	@Query(value = "CALL ReporteporDiasConMasVentasV2()", nativeQuery = true)
	List<Object[]> generarReporteDelDia();
    
     
}
