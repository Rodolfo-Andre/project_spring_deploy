package com.proyecto.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.proyecto.dao.ComandaRepository;
import com.proyecto.entity.Comanda;

@Service
public class ComandaService {
    @Autowired
    ComandaRepository repository;

    public List<Comanda> obtenerTodo() {
        return repository.findAll();
    }

    public Comanda obtenerPorId(int c) {
        return repository.findById(c).orElse(null);
    }

    public Comanda agregar(Comanda c) {
        return repository.save(c);
    }

    public void actualizar(Comanda c) {
        repository.save(c);
    }

    public void eliminar(int id) {
        repository.deleteById(id);
    }

    public Comanda findByMesaId(int mesaId) {
        return repository.findByMesaId(mesaId);
    }

}
