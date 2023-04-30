package com.proyecto.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.proyecto.dao.EstablecimientoRepository;
import com.proyecto.entity.Establecimiento;

@Service
public class EstablecimientoService {
  @Autowired
  private EstablecimientoRepository establecimientoRepository;

  public void actualizar(Establecimiento e) {
    establecimientoRepository.save(e);
  }
}
