package com.proyecto.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.proyecto.dao.EstadoComandaRepository;
import com.proyecto.entity.EstadoComanda;

@Service
public class EstadoComandaService {
  @Autowired
  EstadoComandaRepository estadoComandaRepository;

  public List<EstadoComanda> obtenerTodo() {
    return estadoComandaRepository.findAll();
  }

  public EstadoComanda obtenerPorId(int e) {
    return estadoComandaRepository.findById(e).orElse(null);
  }

  public void agregar(EstadoComanda e) {
    estadoComandaRepository.save(e);
  }

  public void actualizar(EstadoComanda e) {
    estadoComandaRepository.save(e);
  }

  public void eliminar(int id) {
    estadoComandaRepository.deleteById(id);
  }

  public long obtenerTamano() {
    return estadoComandaRepository.count();
  }
}
