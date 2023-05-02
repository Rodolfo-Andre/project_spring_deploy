package com.proyecto.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping(value = "")
public class InicioController {
  @GetMapping(value = "")
  public String index() {
    return "pages/index";
  }
}
