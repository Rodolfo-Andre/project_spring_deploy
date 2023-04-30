package com.proyecto.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
import com.proyecto.dao.UsuarioRepository;
import com.proyecto.entity.Usuario;
import com.proyecto.entity.UsuarioDetallesCustom;

@Service
public class UsuarioDetallesService implements UserDetailsService {
  @Autowired
  private UsuarioRepository usuarioRepository;

  @Override
  public UserDetails loadUserByUsername(String correo) throws UsernameNotFoundException {
    Usuario usuario = usuarioRepository.findByCorreo(correo);

    if (usuario == null) {
      throw new UsernameNotFoundException("No se encontró usuario con el correo proporcionado");
    }

    return new UsuarioDetallesCustom(usuario);
  }
}
