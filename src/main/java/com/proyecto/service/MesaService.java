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

  public List<Mesa> obtenerTodo() {
    return mesaRepository.findAll();
  }

  public Mesa obtenerPorId(Integer m) {
    return mesaRepository.findById(m).orElse(null);
  }

  public List<Mesa> obtenerPorEstado(String e) {
    return mesaRepository.findByEstado(e);
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

  public int obtenerTamanoComandaDeMesa(Integer id) {
    Mesa mesa = mesaRepository.findById(id).orElse(null);
    int tamanoComanda = 0;

    if (mesa == null) {
      return 0;
    }

    tamanoComanda = mesa.getListaComanda().size();

    return tamanoComanda;
  }
}