package com.proyecto.controller;

import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import com.proyecto.dao.UsuarioRepository;
import com.proyecto.dto.codigo.VerificacionCodigoDTO;

@Controller
@RequestMapping(value = "login")
public class SesionController {
  @Autowired
  UsuarioRepository usuarioRepository;

  @GetMapping(value = "")
  public String login() {
    return "pages/login";
  }

  @PostMapping(value = "verificar-codigo")
  @ResponseBody
  public Map<String, Boolean> verificarCodigo(@RequestBody VerificacionCodigoDTO vericador) {
    Map<String, Boolean> respuesta = new HashMap<>();
    respuesta.put(("esCorrecto"), vericador.getCodigo() == 3);

    return respuesta;
  }
}
