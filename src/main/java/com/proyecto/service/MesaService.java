package com.proyecto.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.proyecto.dao.MesaRepository;
import com.proyecto.entity.Mesa;

@Service
public class MesaService {
  @Autowired
  MesaRepository mesaRepository;

  public List<Mesa> getAll() {
    return mesaRepository.findAll();
  }

  public Mesa obtenerPorId(Integer m) {
    return mesaRepository.findById(m).orElse(null);
  }

  public void agregar(Mesa m) {
    mesaRepository.save(m);
  }

  public void actualizar(Mesa m) {
    mesaRepository.save(m);
  }

  public void eliminar(Integer id) {
    mesaRepository.deleteById(id);
  }
}