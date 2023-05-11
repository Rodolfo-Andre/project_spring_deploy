package com.proyecto.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.proyecto.dao.UsuarioRepository;
import com.proyecto.entity.Usuario;

@Service
public class UsuarioService {
  @Autowired
  private UsuarioRepository usuarioRepository;

  public List<Usuario> obtenerTodo() {
    return usuarioRepository.findAll();
  }

  public Usuario obtenerUsuarioPorCorreo(String c) {
    return usuarioRepository.findByCorreo(c);
  }

  public Usuario obtenerPorId(Integer u) {
    return usuarioRepository.findById(u).orElse(null);
  }

  public void agregar(Usuario m) {
    usuarioRepository.save(m);
  }

  public void actualizar(Usuario m) {
    usuarioRepository.save(m);
  }

  public void eliminar(Integer id) {
    usuarioRepository.deleteById(id);
  }

  public long obtenerTamano() {
    return usuarioRepository.count();
  }
}
