package com.proyecto.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import com.proyecto.entity.CategoriaPlato;
import com.proyecto.service.CategoriaPlatoService;

@Controller
@RequestMapping(value = "categoria-plato")
public class CategoriaPlatoController {
  @Autowired
  CategoriaPlatoService categoriaPlatoService;

  @GetMapping(value = "")
  public String index(Model model) {
    model.addAttribute("listaCategoriaPlato", categoriaPlatoService.obtenerTodo());
    return "pages/categoria-plato";
  }

  @GetMapping(value = "obtener/{id}")
  @ResponseBody
  public CategoriaPlato buscarPorId(@PathVariable String id) {
    return categoriaPlatoService.obtenerPorId(id);
  }

  @PostMapping(value = "grabar")
  public String grabar(RedirectAttributes redirect, @RequestParam("name") String nombreCategoria) {
    try {
      CategoriaPlato categoriaPlato = new CategoriaPlato();
      categoriaPlato.setNombre(nombreCategoria);

      categoriaPlatoService.agregar(categoriaPlato);
      redirect.addFlashAttribute("Mensaje", "Categoría agregada correctamente");
    } catch (Exception e) {
      e.printStackTrace();
      redirect.addFlashAttribute("Mensaje", "Error al agregar");
    }

    return "redirect:/categoria-plato";
  }

  @PostMapping(value = "actualizar")
  public String actualizar(RedirectAttributes redirect, @RequestParam("id") String id,
      @RequestParam("name") String nombre) {
    try {
      CategoriaPlato categoriaPlato = categoriaPlatoService.obtenerPorId(id);
      categoriaPlato.setNombre(nombre);

      categoriaPlatoService.actualizar(categoriaPlato);
      redirect.addFlashAttribute("Mensaje", "Categoría actualizada correctamente");
    } catch (Exception e) {
      e.printStackTrace();
      redirect.addFlashAttribute("Mensaje", "Error al actualizar");
    }

    return "redirect:/categoria-plato";
  }

  @PostMapping(value = "eliminar")
  public String actualizar(RedirectAttributes redirect, @RequestParam("id") String id) {
    try {
      categoriaPlatoService.eliminar(id);
      redirect.addFlashAttribute("Mensaje", "Categoría eliminada correctamente");
    } catch (Exception e) {
      e.printStackTrace();
      redirect.addFlashAttribute("Mensaje", "Error al eliminar");
    }

    return "redirect:/categoria-plato";
  }
}
