package com.proyecto.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import com.proyecto.entity.Establecimiento;
import com.proyecto.service.EstablecimientoService;

@Controller
@RequestMapping(value = "/configuracion/establecimiento")
public class EstablecimientoController {
  @Autowired
  EstablecimientoService establecimientoService;

  @GetMapping(value = "")
  public String index(Model model) {
    model.addAttribute("establecimiento", establecimientoService.obtenerPrimero());

    return "pages/establecimiento";
  }

  @PostMapping(value = "/actualizar")
  public String actualizar(RedirectAttributes redirect, Establecimiento establecimiento) {
    try {
      establecimientoService.actualizar(establecimiento);
      redirect.addFlashAttribute("Mensaje", "Establecimiento actualizado correctamente");
    } catch (Exception e) {
      e.printStackTrace();
      redirect.addFlashAttribute("Mensaje", "Error al actualizar");
    }

    return "redirect:/configuracion/establecimiento";
  }
}
