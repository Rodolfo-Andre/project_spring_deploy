package com.proyecto.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import com.proyecto.entity.*;
import com.proyecto.service.EmpleadoService;
import com.proyecto.service.UsuarioService;

@Controller
@RequestMapping(value = "/configuracion/empleado")
public class EmpleadoController {
  @Autowired
  EmpleadoService empleadoService;

  @Autowired
  PasswordEncoder passwordEncoder;

  @Autowired
  UsuarioService usuarioService;

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
      @RequestParam("cargo") int idCargo,
      @RequestParam("correo") String correo,
      RedirectAttributes redirect) {
    try {

      Empleado e = empleadoService.obtenerxId(id);
      e.setNombre(nombre);
      e.setApellido(apellido);
      e.setDni(dni);
      e.setTelefono(telefono);
      Cargo cargo = new Cargo();
      cargo.setId(idCargo);
      e.setCargo(cargo);

      e.getUsuario().setCorreo(correo);

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

  @GetMapping(value = "/verificar-dni/{dni}/{cod}")
  @ResponseBody
  public Map<String, Boolean> verificarDni(@PathVariable String dni, @PathVariable int cod) {

    Map<String, Boolean> respuesta = new HashMap<String, Boolean>();
    Empleado empleado = empleadoService.obtenerPorDni(dni);

    Empleado empleadoActualizar = null;
    boolean seEncontro = false;

    if (cod > 0) {
      empleadoActualizar = empleadoService.obtenerxId(cod);

    }
    if (empleado != null) {

      if (empleadoActualizar != null) {
        if (!empleadoActualizar.getDni().equals(dni)) {
          seEncontro = empleado.getDni().equals(dni);

        }

      } else {
        seEncontro = empleado.getDni().equals(dni);
      }
    }
    respuesta.put("isFound", seEncontro);
    return respuesta;

  }

  @GetMapping(value = "/verificar-correo/{email}/{cod}")
  @ResponseBody
  public Map<String, Boolean> verificarEmail(@PathVariable String email, @PathVariable int cod) {

    Map<String, Boolean> respuesta = new HashMap<String, Boolean>();
    Usuario usuarioActualizar = null;
    Usuario usuario = usuarioService.obtenerUsuarioPorCorreo(email);
    boolean seEncontro = false;
    if (cod > 0) {
      usuarioActualizar = usuarioService.obtenerPorId(cod);

    }
    if (usuario != null) {

      if (usuarioActualizar != null) {
        if (!usuarioActualizar.getCorreo().equals(email)) {
          seEncontro = usuario.getCorreo().equals(email);

        }

      } else {
        seEncontro = usuario.getCorreo().equals(email);
      }
    }

    respuesta.put("isFound", seEncontro);

    return respuesta;

  }

  @GetMapping(value = "/verificar-telefono/{telefono}/{cod}")
  @ResponseBody
  public Map<String, Boolean> verificarTelephone(@PathVariable String telefono, @PathVariable int cod) {

    Map<String, Boolean> respuesta = new HashMap<String, Boolean>();
    Empleado empleado = empleadoService.obtenerPorTelefono(telefono);

    Empleado empleadoActualizar = null;

    boolean seEncontro = false;
    if (cod > 0) {
      empleadoActualizar = empleadoService.obtenerxId(cod);

    }
    if (empleado != null) {

      if (empleadoActualizar != null) {
        if (!empleadoActualizar.getTelefono().equals(telefono)) {
          seEncontro = empleado.getTelefono().equals(telefono);

        }

      } else {
        seEncontro = empleado.getTelefono().equals(telefono);
      }
    }

    respuesta.put("isFound", seEncontro);

    return respuesta;

  }

}
