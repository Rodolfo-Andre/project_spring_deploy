package com.proyecto.controller;

import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import com.proyecto.entity.CategoriaPlato;
import com.proyecto.service.CategoriaPlatoService;

@Controller
@RequestMapping(value = "/configuracion/categoria-plato")
public class CategoriaPlatoController {
  @Autowired
  CategoriaPlatoService categoriaPlatoService;

  @GetMapping(value = "")
  public String index(Model model) {
    model.addAttribute("listaCategoriaPlato", categoriaPlatoService.obtenerTodo());
    return "pages/categoria-plato";
  }

  @GetMapping(value = "/obtener/{id}")
  @ResponseBody
  public CategoriaPlato buscarPorId(@PathVariable String id) {
    return categoriaPlatoService.obtenerPorId(id);
  }

  @GetMapping(value = "/obtener")
  @ResponseBody
  public List<CategoriaPlato> obtenerTodo() {
    return categoriaPlatoService.obtenerTodo();
  }

  @PostMapping(value = "/grabar")
  public String grabar(RedirectAttributes redirect, @RequestParam("name") String nombreCategoria) {
    try {
      CategoriaPlato categoriaPlato = new CategoriaPlato();
      categoriaPlato.setNombre(nombreCategoria);

      categoriaPlatoService.agregar(categoriaPlato);

      redirect.addFlashAttribute("mensaje", "Categoría de plato registrada correctamente");
      redirect.addFlashAttribute("tipo", "success");
    } catch (Exception e) {
      e.printStackTrace();
      redirect.addFlashAttribute("mensaje", "Error al registrar categoría de plato");
      redirect.addFlashAttribute("tipo", "error");
    }

    return "redirect:/configuracion/categoria-plato";
  }

  @PostMapping(value = "/actualizar")
  public String actualizar(RedirectAttributes redirect, @RequestParam("id") String id,
      @RequestParam("name") String nombre) {
    try {
      CategoriaPlato categoriaPlato = categoriaPlatoService.obtenerPorId(id);
      categoriaPlato.setNombre(nombre);

      categoriaPlatoService.actualizar(categoriaPlato);
      redirect.addFlashAttribute("mensaje", "Categoría de plato actualizada correctamente");
      redirect.addFlashAttribute("tipo", "success");
    } catch (Exception e) {
      e.printStackTrace();
      redirect.addFlashAttribute("mensaje", "Error al actualizar categoría de plato");
      redirect.addFlashAttribute("tipo", "error");
    }

    return "redirect:/configuracion/categoria-plato";
  }

  @PostMapping(value = "/eliminar")
  public String eliminar(RedirectAttributes redirect, @RequestParam("id") String id) {
    try {
      categoriaPlatoService.eliminar(id);
      redirect.addFlashAttribute("mensaje", "Categoría de plato eliminada correctamente");
      redirect.addFlashAttribute("tipo", "success");
    } catch (Exception e) {
      e.printStackTrace();
      redirect.addFlashAttribute("mensaje", "Error al eliminar categoría de plato");
      redirect.addFlashAttribute("tipo", "error");
    }

    return "redirect:/configuracion/categoria-plato";
  }

  @GetMapping(value = "/obtener-tamano-plato-por-categoria/{id}")
  @ResponseBody
  public int obtenerTamanoPlatoDeCategoria(@PathVariable String id) {
    return categoriaPlatoService.obtenerTamanoPlatoDeCategoria(id);
  }
}
