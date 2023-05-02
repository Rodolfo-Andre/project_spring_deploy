package com.proyecto.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import com.proyecto.entity.MetodoPago;
import com.proyecto.service.MetodoPagoService;

@Controller
@RequestMapping(value = "metodo-pago")
public class MetodoPagoController {
  @Autowired
  MetodoPagoService metodoPagoService;

  @GetMapping(value = "")
  public String index(Model model) {
    model.addAttribute("listaMetodoPago", metodoPagoService.obtenerTodo());
    return "pages/metodo-pago";
  }

  @GetMapping(value = "obtener/{id}")
  @ResponseBody
  public MetodoPago buscarPorId(@PathVariable Integer id) {
    return metodoPagoService.obtenerPorId(id);
  }

  @PostMapping(value = "grabar")
  public String grabar(RedirectAttributes redirect, @RequestParam("name") String metodo) {
    try {
      MetodoPago metodoPago = new MetodoPago();
      metodoPago.setMetodo(metodo);

      metodoPagoService.agregar(metodoPago);
      redirect.addFlashAttribute("Mensaje", "Método de pago agregado correctamente");
    } catch (Exception e) {
      e.printStackTrace();
      redirect.addFlashAttribute("Mensaje", "Error al agregar");
    }

    return "redirect:/metodo-pago";
  }

  @PostMapping(value = "actualizar")
  public String actualizar(RedirectAttributes redirect, @RequestParam("id") int id,
      @RequestParam("name") String metodo) {
    try {
      MetodoPago metodoPago = metodoPagoService.obtenerPorId(id);
      metodoPago.setMetodo(metodo);

      metodoPagoService.actualizar(metodoPago);
      redirect.addFlashAttribute("Mensaje", "Método de pago actualizado correctamente");
    } catch (Exception e) {
      e.printStackTrace();
      redirect.addFlashAttribute("Mensaje", "Error al actualizar");
    }

    return "redirect:/metodo-pago";
  }

  @PostMapping(value = "eliminar")
  public String eliminar(RedirectAttributes redirect, @RequestParam("id") int id) {
    try {
      metodoPagoService.eliminar(id);
      redirect.addFlashAttribute("Mensaje", "Método de pago eliminado correctamente");
    } catch (Exception e) {
      e.printStackTrace();
      redirect.addFlashAttribute("Mensaje", "Error al eliminar");
    }

    return "redirect:/metodo-pago";
  }
}
