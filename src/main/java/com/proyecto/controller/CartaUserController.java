package com.proyecto.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.proyecto.service.CategoriaPlatoService;
import com.proyecto.service.PlatoService;

@Controller
@RequestMapping(value = "/configuracion/cartaUser")
public class CartaUserController {

  @Autowired
  CategoriaPlatoService categoriaPlatoService;
  @Autowired
  PlatoService platoService;

  @GetMapping(value = "")
  public String index(Model model) {
    model.addAttribute("listaCategoriaPlato", categoriaPlatoService.obtenerTodo());

    model.addAttribute("listaPlato", platoService.obtenerTodo());

    System.out.println("cantidad " + platoService.obtenerTodo().size());
    return "pages/cartaUser";
  }

}
