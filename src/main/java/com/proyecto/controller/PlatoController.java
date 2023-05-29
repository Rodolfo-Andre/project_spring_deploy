package com.proyecto.controller;

import java.util.List;

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
@RequestMapping(value = "/configuracion/plato")
public class PlatoController {
  @Autowired
  PlatoService platoService;

  @GetMapping(value = "")
  public String index(Model model) {
    model.addAttribute("listaPlato", platoService.obtenerTodo());
    return "pages/plato";
  }

  @GetMapping(value = "/obtener/{id}")
  @ResponseBody
  public Plato buscarPorId(@PathVariable String id) {
    return platoService.obtenerPorId(id);
  }

  @GetMapping(value = "/obtener")
  @ResponseBody
  public List<Plato> listar() {
    return platoService.obtenerTodo();
  }

  @PostMapping(value = "/grabar")
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
      redirect.addFlashAttribute("mensaje", "Plato registrado correctamente");
      redirect.addFlashAttribute("tipo", "success");
    } catch (Exception e) {
      e.printStackTrace();
      redirect.addFlashAttribute("mensaje", "Error al registrar plato");
      redirect.addFlashAttribute("tipo", "error");
    }

    return "redirect:/configuracion/plato";
  }

  @PostMapping(value = "/actualizar")
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
      redirect.addFlashAttribute("mensaje", "Plato actualizado correctamente");
      redirect.addFlashAttribute("tipo", "success");
    } catch (Exception e) {
      e.printStackTrace();
      redirect.addFlashAttribute("mensaje", "Error al actualizar plato");
      redirect.addFlashAttribute("tipo", "error");
    }

    return "redirect:/configuracion/plato";
  }

  @PostMapping(value = "/eliminar")
  public String eliminar(RedirectAttributes redirect, @RequestParam("id") String id) {
    try {
      platoService.eliminar(id);
      redirect.addFlashAttribute("mensaje", "Plato eliminado correctamente");
      redirect.addFlashAttribute("tipo", "success");
    } catch (Exception e) {
      e.printStackTrace();
      redirect.addFlashAttribute("mensaje", "Error al eliminar plato");
      redirect.addFlashAttribute("tipo", "error");
    }

    return "redirect:/configuracion/plato";
  }

  @GetMapping(value = "/obtener-tamano-detalle-comanda-por-plato/{id}")
  @ResponseBody
  public int obtenerTamanoDetalleComandaDePlato(@PathVariable String id) {
    return platoService.obtenerTamanoDetalleComandaDePlato(id);
  }
}
