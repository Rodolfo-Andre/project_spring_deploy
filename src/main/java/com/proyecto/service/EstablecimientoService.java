package com.proyecto.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.proyecto.dao.EstablecimientoRepository;
import com.proyecto.entity.Establecimiento;

@Service
public class EstablecimientoService {
	@Autowired
	private EstablecimientoRepository repo;
	
	
	//Updateamos, aquí el establecimiento ya está creado, solo actualizamos la información
	public void update(Establecimiento e) {
		repo.save(e);
	}
}
