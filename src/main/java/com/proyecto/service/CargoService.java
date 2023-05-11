package com.proyecto.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.proyecto.dao.CargoRepository;
import com.proyecto.entity.Cargo;

@Service
public class CargoService {
  @Autowired
  CargoRepository cargoRepository;

  public List<Cargo> obtenerTodo() {
    return cargoRepository.findAll();
  }

  public Cargo obtenerPorId(int c) {
    return cargoRepository.findById(c).orElse(null);
  }

  public Cargo obtenerPorNombre(String n) {
    return cargoRepository.findByNombre(n);
  }

  public void agregar(Cargo c) {
    cargoRepository.save(c);
  }

  public void actualizar(Cargo c) {
    cargoRepository.save(c);
  }

  public void eliminar(int id) {
    cargoRepository.deleteById(id);
  }

  public long obtenerTamano() {
    return cargoRepository.count();
  }
}
