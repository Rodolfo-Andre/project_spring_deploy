package com.proyecto.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.proyecto.dao.MetodoPagoRepository;
import com.proyecto.entity.MetodoPago;

@Service
public class MetodoPagoService {
  @Autowired
  MetodoPagoRepository metodoPagoRepository;

  public List<MetodoPago> obtenerTodo() {
    return metodoPagoRepository.findAll();
  }

  public MetodoPago obtenerPorId(Integer m) {
    return metodoPagoRepository.findById(m).orElse(null);
  }

  public void agregar(MetodoPago m) {
    metodoPagoRepository.save(m);
  }

  public void actualizar(MetodoPago m) {
    metodoPagoRepository.save(m);
  }

  public void eliminar(Integer id) {
    metodoPagoRepository.deleteById(id);
  }
}
