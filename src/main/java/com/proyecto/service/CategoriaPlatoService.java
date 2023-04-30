package com.proyecto.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.proyecto.dao.CategoriaPlatoRepository;
import com.proyecto.entity.CategoriaPlato;

@Service
public class CategoriaPlatoService {
  @Autowired
  CategoriaPlatoRepository categoriaPlatoRepository;

  public List<CategoriaPlato> obtenerTodo() {
    return categoriaPlatoRepository.findAll();
  }

  public CategoriaPlato obtenerPorId(String c) {
    return categoriaPlatoRepository.findById(c).orElse(null);
  }

  public void agregar(CategoriaPlato c) {
    c.setId(CategoriaPlato.generarIdCategoriaPlato(this.obtenerTodo()));
    categoriaPlatoRepository.save(c);
  }

  public void actualizar(CategoriaPlato c) {
    categoriaPlatoRepository.save(c);
  }

  public void eliminar(String id) {
    categoriaPlatoRepository.deleteById(id);
  }
}