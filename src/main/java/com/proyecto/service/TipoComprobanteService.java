package com.proyecto.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.proyecto.dao.TipoComprobanteRepository;
import com.proyecto.entity.TipoComprobante;

@Service
public class TipoComprobanteService {
  @Autowired
  TipoComprobanteRepository tipoComprobanteRepository;

  public List<TipoComprobante> obtenerTodo() {
    return tipoComprobanteRepository.findAll();
  }

  public TipoComprobante obtenerPorId(int t) {
    return tipoComprobanteRepository.findById(t).orElse(null);
  }

  public void agregar(TipoComprobante t) {
    tipoComprobanteRepository.save(t);
  }

  public void actualizar(TipoComprobante t) {
    tipoComprobanteRepository.save(t);
  }

  public void eliminar(int id) {
    tipoComprobanteRepository.deleteById(id);
  }

  public long obtenerTamano() {
    return tipoComprobanteRepository.count();
  }
}
