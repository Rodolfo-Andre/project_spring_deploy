package com.proyecto.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.proyecto.dao.CajaRepository;
import com.proyecto.dao.EstablecimientoRepository;
import com.proyecto.entity.Caja;
import com.proyecto.entity.Establecimiento;
import com.proyecto.entity.Plato;

@Service
public class CajaService {
	@Autowired
	private CajaRepository cajarepository;
	
	public List<Caja> obtenerTodo() {
		return cajarepository.findAll();
	}

	public void agregar(Caja c) {
		c.setId(Caja.generarIdCaja(this.obtenerTodo()));
		cajarepository.save(c);
	}

	public void eliminar(String id) {
		cajarepository.deleteById(id);
	}
 
	
}
