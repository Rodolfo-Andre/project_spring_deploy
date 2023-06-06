package com.proyecto.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.proyecto.dao.PlatoRepository;
import com.proyecto.entity.Plato;

@Service
public class PlatoService {
  @Autowired
  PlatoRepository platoRepository;

  public List<Plato> obtenerTodo() {
    return platoRepository.findAll();
  }

  public Plato obtenerPorId(String p) {
    return platoRepository.findById(p).orElse(null);
  }

  public void agregar(Plato p) {
    p.setId(Plato.generarIdPlato(this.obtenerTodo()));
    platoRepository.save(p);
  }

  public void actualizar(Plato p) {
    platoRepository.save(p);
  }

  public void eliminar(String id) {
    platoRepository.deleteById(id);
  }

  public int obtenerTamanoDetalleComandaDePlato(String id) {
    Plato plato = platoRepository.findById(id).orElse(null);
    int tamanoDetalleComanda = 0;

    if (plato == null) {
      return 0;
    }

    tamanoDetalleComanda = plato.getListaDetalleComanda().size();

    return tamanoDetalleComanda;
  }

  public List<Plato> obtenerPlatoByCategoriId(String idCategoria) {
    return platoRepository.findPlatoByCategoriaId(idCategoria);
  }
}
