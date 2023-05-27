package com.proyecto.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.proyecto.dao.CajaRepository;
import com.proyecto.entity.Caja;

@Service
public class CajaService {
  @Autowired
  private CajaRepository cajarepository;

  public List<Caja> obtenerTodo() {
    return cajarepository.findAll();
  }

  public void agregar(Caja c) {
    c.setId(Caja.generarIdCaja(this.obtenerTodo()));
    cajarepository.save(c);
  }

  public void eliminar(String id) {
    cajarepository.deleteById(id);
  }
}
