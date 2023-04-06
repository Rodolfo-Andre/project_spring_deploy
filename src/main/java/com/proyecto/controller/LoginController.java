package com.proyecto.controller;

import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import com.proyecto.dto.usuario.RegistroUsuarioDTO;

import jakarta.validation.Valid;

@Controller
@RequestMapping(value = "login")
public class LoginController {
  @GetMapping(value = "/")
  public String login(RegistroUsuarioDTO registroUsuarioDTO) {
    return "login";
  }

  @PostMapping(value = "/")
  public String autenticarUsuario(@Valid RegistroUsuarioDTO registroUsuarioDTO,  BindingResult bindingResult) {
    if (bindingResult.hasErrors()) {
			return "login";
		}

    return "redirect:/login";
  }
}
