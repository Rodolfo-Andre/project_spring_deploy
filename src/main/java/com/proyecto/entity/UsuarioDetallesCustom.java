package com.proyecto.entity;

import java.util.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public class UsuarioDetallesCustom implements UserDetails {
  private Usuario usuario;

  public UsuarioDetallesCustom(Usuario usuario) {
    this.usuario = usuario;
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    Cargo cargo = usuario.getEmpleado().getCargo();

    ArrayList<SimpleGrantedAuthority> list = new ArrayList<>();
    list.add(new SimpleGrantedAuthority(cargo.getNombre()));

    return list;
  }

  @Override
  public String getUsername() {
    return usuario.getCorreo();
  }

  @Override
  public String getPassword() {
    return usuario.getContrasena();
  }

  @Override
  public boolean isAccountNonExpired() {
    return true;
  }

  @Override
  public boolean isAccountNonLocked() {
    return true;
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return true;
  }

  @Override
  public boolean isEnabled() {
    return true;
  }

  public Usuario getUsuario() {
    return usuario;
  }
}
