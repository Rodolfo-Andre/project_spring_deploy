package com.proyecto.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import com.proyecto.entity.Usuario;
import com.proyecto.entity.UsuarioDetallesCustom;
import com.proyecto.interfaces.UsuarioActual;

@Controller
@RequestMapping(value = "/usuario")
public class UsuarioController {
  @GetMapping("")
  @ResponseBody
  public Usuario obtenerUsuarioActual(@UsuarioActual UsuarioDetallesCustom usuario) {
    return usuario.getUsuario();
  }
}
