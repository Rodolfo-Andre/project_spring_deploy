package com.proyecto.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import com.proyecto.entity.*;
import com.proyecto.service.PlatoService;
import com.proyecto.utils.ServicioImagen;

@Controller
@RequestMapping(value = "plato")
public class PlatoController {
  @Autowired
  PlatoService platoService;

  @GetMapping(value = "")
  public String index(Model model) {
    model.addAttribute("listaPlato", platoService.obtenerTodo());
    return "pages/plato";
  }

  @GetMapping(value = "obtener/{id}")
  @ResponseBody
  public Plato buscarPorId(@PathVariable String id) {
    return platoService.obtenerPorId(id);
  }

  @PostMapping(value = "grabar")
  public String grabar(RedirectAttributes redirect,
      @RequestParam("name") String nombre,
      @RequestParam("price") Double precio,
      @RequestParam("image") MultipartFile imagen,
      @RequestParam("cboCategoryDish") String idCategoria) {
    try {
      Plato plato = new Plato();

      plato.setNombre(nombre);
      plato.setPrecioPlato(precio);
      plato.setImagen(ServicioImagen.subirImagen(imagen.getBytes()).get("url").toString());

      CategoriaPlato categoriaPlato = new CategoriaPlato();
      categoriaPlato.setId(idCategoria);

      plato.setCategoriaPlato(categoriaPlato);

      platoService.agregar(plato);
      redirect.addFlashAttribute("Mensaje", "Plato agregado correctamente");
    } catch (Exception e) {
      e.printStackTrace();
      redirect.addFlashAttribute("Mensaje", "Error al agregar");
    }

    return "redirect:/plato";
  }

  @PostMapping(value = "actualizar")
  public String actualizar(RedirectAttributes redirect,
      @RequestParam("id") String id,
      @RequestParam("name") String nombre,
      @RequestParam("price") Double precio,
      @RequestParam("image") MultipartFile imagen,
      @RequestParam("cboCategoryDish") String idCategoria) {
    try {
      Plato plato = platoService.obtenerPorId(id);

      plato.setNombre(nombre);
      plato.setPrecioPlato(precio);

      if (imagen.getSize() > 0) {
        plato.setImagen(ServicioImagen.subirImagen(imagen.getBytes()).get("url").toString());
      }

      CategoriaPlato categoriaPlato = new CategoriaPlato();
      categoriaPlato.setId(idCategoria);

      plato.setCategoriaPlato(categoriaPlato);

      platoService.actualizar(plato);
      redirect.addFlashAttribute("Mensaje", "Plato actualizado correctamente");
    } catch (Exception e) {
      e.printStackTrace();
      redirect.addFlashAttribute("Mensaje", "Error al actualizar");
    }

    return "redirect:/plato";
  }

  @PostMapping(value = "eliminar")
  public String eliminar(RedirectAttributes redirect, @RequestParam("id") String id) {
    try {
      platoService.eliminar(id);
      redirect.addFlashAttribute("Mensaje", "Plato eliminado correctamente");
    } catch (Exception e) {
      e.printStackTrace();
      redirect.addFlashAttribute("Mensaje", "Error al eliminar");
    }

    return "redirect:/plato";
  }
}
