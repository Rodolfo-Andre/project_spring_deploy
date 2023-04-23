package com.proyecto.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.proyecto.dao.EstablecimientoRepository;
import com.proyecto.entity.Establecimiento;

@Service
public class EstablecimientoService {
  @Autowired
  private EstablecimientoRepository repo;

  public void update(Establecimiento e) {
    repo.save(e);
  }
}
