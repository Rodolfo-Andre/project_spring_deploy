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
      redirect.addFlashAttribute("mensaje", "Establecimiento actualizado correctamente");
      redirect.addFlashAttribute("tipo", "success");
    } catch (Exception e) {
      e.printStackTrace();
      redirect.addFlashAttribute("mensaje", "Error al eliminar establecimiento");
      redirect.addFlashAttribute("tipo", "error");
    }

    return "redirect:/configuracion/establecimiento";
  }
}
