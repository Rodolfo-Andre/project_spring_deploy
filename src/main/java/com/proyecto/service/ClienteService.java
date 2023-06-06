package com.proyecto.service;

import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.proyecto.dao.ClienteRepository;
import com.proyecto.entity.Cliente;

@Service
public class ClienteService {
  @Autowired
  ClienteRepository clienteRepository;

  public List<Cliente> obtenerTodo() {
    return clienteRepository.findAll();
  }

  public Cliente obtenerPorId(int t) {
    return clienteRepository.findById(t).orElse(null);
  }

  public Cliente obtenerPrimero() {
    return clienteRepository.findAll().get(0);
  }

  public Cliente obtenerPorDni(String d) {
    return clienteRepository.findByDni(d);
  }

  public void agregar(Cliente t) {
    clienteRepository.save(t);
  }

  public long obtenerTamano() {
    return clienteRepository.count();
  }

  public void actualizar(Cliente t) {
    clienteRepository.save(t);
  }
}
