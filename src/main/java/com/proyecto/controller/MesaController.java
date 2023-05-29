package com.proyecto.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import com.proyecto.entity.Mesa;
import com.proyecto.service.MesaService;

@Controller
@RequestMapping(value = "/configuracion/mesa")
public class MesaController {
  @Autowired
  MesaService mesaService;

  @GetMapping(value = "")
  public String index(Model model) {
    model.addAttribute("listaMesas", mesaService.obtenerTodo());
    return "pages/mesas";
  }

  @GetMapping(value = "/obtener")
  @ResponseBody
  public List<Mesa> getMesas() {
    return mesaService.obtenerTodo();
  }

  @GetMapping(value = "/obtener/{id}")
  @ResponseBody
  public Mesa buscarPorId(@PathVariable Integer id) {
    return mesaService.obtenerPorId(id);
  }

  @PostMapping(value = "/grabar")
  public String grabar(RedirectAttributes redirect, @RequestParam("quantityChairs") int sillas) {
    try {
      Mesa mesa = new Mesa();
      mesa.setCantidadAsientos(sillas);
      mesa.setEstado("Libre");
      mesaService.agregar(mesa);
      redirect.addFlashAttribute("mensaje", "Mesa registrada correctamente");
      redirect.addFlashAttribute("tipo", "success");
    } catch (Exception e) {
      e.printStackTrace();
      redirect.addFlashAttribute("mensaje", "Error al registrar mesa");
      redirect.addFlashAttribute("tipo", "error");
    }

    return "redirect:/configuracion/mesa";
  }

  @PostMapping(value = "/actualizar")
  public String actualizar(RedirectAttributes redirect, @RequestParam("id") int id,
      @RequestParam("quantityChairs") int sillas) {
    try {
      Mesa mesa = mesaService.obtenerPorId(id);
      mesa.setCantidadAsientos(sillas);

      mesaService.actualizar(mesa);
      redirect.addFlashAttribute("mensaje", "Mesa actualizada correctamente");
      redirect.addFlashAttribute("tipo", "success");
    } catch (Exception e) {
      e.printStackTrace();
      redirect.addFlashAttribute("mensaje", "Error al actualizar mesa");
      redirect.addFlashAttribute("tipo", "error");
    }

    return "redirect:/configuracion/mesa";
  }

  @PostMapping(value = "/eliminar")
  public String eliminar(RedirectAttributes redirect, @RequestParam("id") int id) {
    try {
      mesaService.eliminar(id);
      redirect.addFlashAttribute("mensaje", "Mesa eliminada correctamente");
      redirect.addFlashAttribute("tipo", "success");
    } catch (Exception e) {
      e.printStackTrace();
      redirect.addFlashAttribute("mensaje", "Error al eliminar mesa");
      redirect.addFlashAttribute("tipo", "error");
    }

    return "redirect:/configuracion/mesa";
  }

  @GetMapping(value = "/obtener-tamano-comanda-por-mesa/{id}")
  @ResponseBody
  public int obtenerTamanoComandaDeMesa(@PathVariable int id) {
    return mesaService.obtenerTamanoComandaDeMesa(id);
  }
}
