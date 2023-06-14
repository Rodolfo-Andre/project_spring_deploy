package com.proyecto.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.proyecto.dao.DetalleComandaRepository;
import com.proyecto.entity.DetalleComanda;

@Service
public class DetalleComandaService {
    @Autowired
    DetalleComandaRepository repository;

    public void registrar(DetalleComanda d) {
        repository.save(d);
    }

    public void actualizar(DetalleComanda d) {
        repository.save(d);
    }

    public void eliminar(Integer id) {
        repository.deleteById(id);
    }

    public DetalleComanda findByComandaId(int comandaId, String platoId) {
        return repository.findByPlatoComandaId(comandaId, platoId);
    }

    public List<DetalleComanda> findByComandaId(int comandaId) {
        return repository.findByComandaId(comandaId);
    }


    public DetalleComanda findDetalleComandaByPlatoIdAndComandaId(String platoId, int comandaId) {
        return repository.findDetalleComandaByPlatoIdAndComandaId(platoId, comandaId);
    }
    
    public List<Object[]> generarReportePlato(){
    	return repository.generarReporteplato();
    }
}
