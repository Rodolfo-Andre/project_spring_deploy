package com.proyecto.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import com.proyecto.entity.Caja;
import com.proyecto.service.*;

@Controller
@RequestMapping(value = "/configuracion/caja")
public class CajaController {
  @Autowired
  CajaService cajaservice;

  @Autowired
  EstablecimientoService establecimientoService;

  @GetMapping(value = "")
  public String index(Model model) {
    model.addAttribute("listaCaja", cajaservice.obtenerTodo());
    return "pages/caja";
  }

  @PostMapping(value = "/grabar")
  public String grabar(RedirectAttributes redirect) {
    try {
      Caja caja = new Caja();
      caja.setEstablecimiento(establecimientoService.obtenerPrimero());

      cajaservice.agregar(caja);

      redirect.addFlashAttribute("mensaje", "Caja registrada correctamente");
      redirect.addFlashAttribute("tipo", "success");
    } catch (Exception e) {
      e.printStackTrace();
      redirect.addFlashAttribute("mensaje", "Error al registrar caja");
      redirect.addFlashAttribute("tipo", "error");
    }

    return "redirect:/configuracion/caja";
  }

  @PostMapping(value = "/eliminar")
  public String eliminar(RedirectAttributes redirect, @RequestParam("id") String id) {
    try {
      cajaservice.eliminar(id);
      redirect.addFlashAttribute("mensaje", "Caja eliminada correctamente");
      redirect.addFlashAttribute("tipo", "success");
    } catch (Exception e) {
      e.printStackTrace();
      redirect.addFlashAttribute("mensaje", "Error al eliminar caja");
      redirect.addFlashAttribute("tipo", "error");
    }

    return "redirect:/configuracion/caja";
  }
}
