package com.proyecto.controller;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import com.proyecto.dao.EmpleadoRepository;
import com.proyecto.dto.codigo.VerificacionCodigoDTO;
import com.proyecto.dto.usuario.RegistroUsuarioDTO;
import com.proyecto.entity.Empleado;
import com.proyecto.entity.Usuario;

import jakarta.validation.Valid;

@Controller
@RequestMapping(value = "login")
public class SesionController {
  @Autowired
  EmpleadoRepository empleadoRepository;

  @GetMapping(value = "")
  public String login(RegistroUsuarioDTO registroUsuarioDTO) {
    return "pages/login";
  }

  @PostMapping(value = "")
  public String autenticarUsuario(@Valid RegistroUsuarioDTO registroUsuarioDTO, BindingResult bindingResult) {
    if (bindingResult.hasErrors()) {
      return "pages/login";
    }

    // Usuario empleado = empleadoRepository.findBy();

    return "redirect:/login";
  }

  @PostMapping(value = "verificar-codigo")
  @ResponseBody
  public Map<String, Boolean> verificarCodigo(@RequestBody VerificacionCodigoDTO vericador) {
    Map<String, Boolean> respuesta = new HashMap<>();
    respuesta.put(("esCorrecto"), vericador.getCodigo() == 3);

    return respuesta;
  }
}
