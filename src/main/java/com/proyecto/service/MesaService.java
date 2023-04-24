package com.proyecto.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.proyecto.dao.MesaRepository;
import com.proyecto.entity.Mesa;

@Service
public class MesaService {
	@Autowired
	MesaRepository repo;
	
	public List<Mesa> getAll(){
		return repo.findAll();
	}
	
	public void agregar(Mesa m) {
		repo.save(m);
	}
	
	public void modificar(Mesa m) {
		repo.save(m);
	}
	
	public void Eliminar(Integer id) {
		repo.deleteById(id);
	}
}
