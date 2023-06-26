package com.proyecto.controller;

import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import com.proyecto.entity.*;
import com.proyecto.service.MetodoPagoService;

@Controller
@RequestMapping(value = "/configuracion/metodo-pago")
public class MetodoPagoController {
  @Autowired
  MetodoPagoService metodoPagoService;

  @GetMapping(value = "")
  public String index(Model model) {
    model.addAttribute("listaMetodoPago", metodoPagoService.obtenerTodo());
    return "pages/metodo-pago";
  }

  @GetMapping(value = "/obtener/{id}")
  @ResponseBody
  public MetodoPago buscarPorId(@PathVariable Integer id) {
    return metodoPagoService.obtenerPorId(id);
  }

  @GetMapping(value = "/obtener")
  @ResponseBody
  public List<MetodoPago> obtenerTodos() {
    return metodoPagoService.obtenerTodo();
  }

  @PostMapping(value = "/grabar")
  public String grabar(RedirectAttributes redirect, @RequestParam("name") String metodo) {
    try {
      MetodoPago metodoPago = new MetodoPago();
      metodoPago.setMetodo(metodo);

      metodoPagoService.agregar(metodoPago);
      redirect.addFlashAttribute("mensaje", "Método de pago registrado correctamente");
      redirect.addFlashAttribute("tipo", "success");
    } catch (Exception e) {
      e.printStackTrace();
      redirect.addFlashAttribute("mensaje", "Error al registrar método de pago");
      redirect.addFlashAttribute("tipo", "error");
    }

    return "redirect:/configuracion/metodo-pago";
  }

  @PostMapping(value = "/actualizar")
  public String actualizar(RedirectAttributes redirect, @RequestParam("id") int id,
      @RequestParam("name") String metodo) {
    try {
      MetodoPago metodoPago = metodoPagoService.obtenerPorId(id);
      metodoPago.setMetodo(metodo);

      metodoPagoService.actualizar(metodoPago);
      redirect.addFlashAttribute("mensaje", "Método de pago actualizado correctamente");
      redirect.addFlashAttribute("tipo", "success");
    } catch (Exception e) {
      e.printStackTrace();
      redirect.addFlashAttribute("mensaje", "Error al actualizar método de pago");
      redirect.addFlashAttribute("tipo", "error");
    }

    return "redirect:/configuracion/metodo-pago";
  }

  @PostMapping(value = "/eliminar")
  public String eliminar(RedirectAttributes redirect, @RequestParam("id") int id) {
    try {
      metodoPagoService.eliminar(id);
      redirect.addFlashAttribute("mensaje", "Método de pago eliminado correctamente");
      redirect.addFlashAttribute("tipo", "success");
    } catch (Exception e) {
      e.printStackTrace();
      redirect.addFlashAttribute("mensaje", "Error al eliminar método de pago");
      redirect.addFlashAttribute("tipo", "error");
    }

    return "redirect:/configuracion/metodo-pago";
  }

  @GetMapping(value = "/obtener-tamano-comprobante-por-metodo/{id}")
  @ResponseBody
  public int obtenerTamanoComprobanteDeMetodoPago(@PathVariable Integer id) {
    return metodoPagoService.obtenerTamanoComprobanteDeMetodoPago(id);
  }

  @GetMapping(value = { "/verificar-metodo/{metodo}", "/verificar-metodo/{metodo}/{cod}" })
  @ResponseBody
  public Map<String, Boolean> verificarMetodo(@PathVariable String metodo,
      @PathVariable(required = false) Optional<Integer> cod) {
    Map<String, Boolean> respuesta = new HashMap<>();
    boolean seEncontro = false;

    if (!cod.isPresent()) {
      seEncontro = metodoPagoService.obtenerPorMetodo(metodo) != null;
    } else {
      MetodoPago metodoPago = metodoPagoService.obtenerPorMetodo(metodo);
      seEncontro = metodoPago != null && !metodoPago.getId().equals(cod.get());
    }

    respuesta.put("isFound", seEncontro);
    return respuesta;
  }
}
