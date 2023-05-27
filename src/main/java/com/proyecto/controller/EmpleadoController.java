package com.proyecto.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import com.proyecto.entity.*;
import com.proyecto.service.EmpleadoService;

@Controller
@RequestMapping(value = "/configuracion/empleado")
public class EmpleadoController {
  @Autowired
  EmpleadoService empleadoService;

  @Autowired
  PasswordEncoder passwordEncoder;

  @GetMapping(value = "")
  public String index(Model model) {
    model.addAttribute("listar", empleadoService.listarEmpleado());
    return "pages/empleado";
  }

  @GetMapping(value = "/obtener/{id}")
  @ResponseBody
  public Empleado buscarPorId(@PathVariable Integer id) {
    return empleadoService.obtenerxId(id);
  }

  @RequestMapping(value = "/registrar")
  public String registrar(@RequestParam("nameEmpleado") String nombre,
      @RequestParam("lastnameEmpleado") String apellido,
      @RequestParam("telefono") String telefono,
      @RequestParam("dni") String dni,
      @RequestParam("cargo") int cargo,
      @RequestParam("correo") String correo,
      RedirectAttributes redirect) {
    try {
      Empleado e = new Empleado();
      e.setNombre(nombre);
      e.setApellido(apellido);
      e.setDni(dni);
      e.setTelefono(telefono);

      Cargo c = new Cargo();
      c.setId(cargo);

      e.setCargo(c);

      Usuario u = new Usuario();
      u.setContrasena(passwordEncoder.encode(Empleado.generarContrasenia(apellido)));
      u.setCorreo(correo);

      e.setUsuario(u);

      empleadoService.registrar(e);
      redirect.addFlashAttribute("mensaje", "Empleado registrado correctamente");
      redirect.addFlashAttribute("tipo", "success");
    } catch (Exception e) {
      e.printStackTrace();
      redirect.addFlashAttribute("mensaje", "Error al registrar empleado");
      redirect.addFlashAttribute("tipo", "error");
    }

    return "redirect:/configuracion/empleado";
  }

  @PostMapping(value = "/actualizar")
  public String actualizar(@RequestParam("id") int id,
      @RequestParam("nameEmpleado") String nombre,
      @RequestParam("lastnameEmpleado") String apellido,
      @RequestParam("telefono") String telefono,
      @RequestParam("dni") String dni,
      @RequestParam("cargo") int cargo,
      @RequestParam("correo") String correo,
      RedirectAttributes redirect) {
    try {

      Empleado e = empleadoService.obtenerxId(id);
      e.setNombre(nombre);
      e.setApellido(apellido);
      e.setDni(dni);
      e.setTelefono(telefono);

      Cargo c = new Cargo();
      c.setId(cargo);

      e.setCargo(c);

      Usuario u = new Usuario();

      u.setCorreo(correo);

      e.setUsuario(u);

      empleadoService.actualizar(e);
      redirect.addFlashAttribute("mensaje", "Empleado actualizado correctamente");
      redirect.addFlashAttribute("tipo", "success");
    } catch (Exception e) {
      e.printStackTrace();
      redirect.addFlashAttribute("mensaje", "Error al actualizar empleado");
      redirect.addFlashAttribute("tipo", "error");
    }

    return "redirect:/configuracion/empleado";
  }

  @PostMapping(value = "/eliminar")
  public String eliminar(RedirectAttributes redirect, @RequestParam("id") int id) {
    try {
      empleadoService.eliminar(id);
      redirect.addFlashAttribute("mensaje", "Empleado eliminado correctamente");
      redirect.addFlashAttribute("tipo", "success");
    } catch (Exception e) {
      e.printStackTrace();
      redirect.addFlashAttribute("mensaje", "Error al eliminar empleado");
      redirect.addFlashAttribute("tipo", "error");
    }

    return "redirect:/configuracion/empleado";
  }
}
