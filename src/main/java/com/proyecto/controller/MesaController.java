package com.proyecto.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import com.proyecto.entity.Mesa;
import com.proyecto.service.MesaService;

@Controller
@RequestMapping(value = "mesa")
public class MesaController {
  @Autowired
  MesaService mesaServices;

  @GetMapping(value = "")
  public String index(Model model) {
    model.addAttribute("listaMesas", mesaServices.getAll());
    return "pages/mesas";
  }

  @GetMapping(value = "obtener/{id}")
  @ResponseBody
  public Mesa buscarPorId(@PathVariable Integer id, Model model) {
    return mesaServices.obtenerPorId(id);
  }

  @PostMapping(value = "grabar")
  public String grabar(RedirectAttributes redirect, @RequestParam("quantityChairs") int sillas) {
    try {
      Mesa mesa = new Mesa();
      mesa.setCantidadAsientos(sillas);
      mesa.setEstado("Libre");
      mesaServices.agregar(mesa);
      redirect.addFlashAttribute("Mensaje", "Mesa agregada correctamente");
    } catch (Exception e) {
      e.printStackTrace();
      redirect.addFlashAttribute("Mensaje", "Error al agregar");
    }

    return "redirect:/mesa";
  }

  @PostMapping(value = "actualizar")
  public String actualizar(RedirectAttributes redirect, @RequestParam("id") int id,
      @RequestParam("quantityChairs") int sillas) {
    try {
      Mesa mesa = mesaServices.obtenerPorId(id);
      mesa.setCantidadAsientos(sillas);

      mesaServices.actualizar(mesa);
      redirect.addFlashAttribute("Mensaje", "Mesa actualizada correctamente");
    } catch (Exception e) {
      e.printStackTrace();
      redirect.addFlashAttribute("Mensaje", "Error al actualizar");
    }

    return "redirect:/mesa";
  }

  @PostMapping(value = "eliminar")
  public String actualizar(RedirectAttributes redirect, @RequestParam("id") int id) {
    try {
      mesaServices.eliminar(id);
      redirect.addFlashAttribute("Mensaje", "Mesa eliminada correctamente");
    } catch (Exception e) {
      e.printStackTrace();
      redirect.addFlashAttribute("Mensaje", "Error al eliminar");
    }

    return "redirect:/mesa";
  }
}
