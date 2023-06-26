package com.proyecto.controller;

import java.util.*;
import java.util.concurrent.CompletableFuture;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import com.proyecto.entity.*;
import com.proyecto.service.*;
import com.proyecto.utils.ServicioCorreo;

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
      String contrasenia = Empleado.generarContrasenia(apellido);
      e.setNombre(nombre);
      e.setApellido(apellido);
      e.setDni(dni);
      e.setTelefono(telefono);

      Cargo c = new Cargo();
      c.setId(cargo);

      e.setCargo(c);

      Usuario u = new Usuario();

      u.setContrasena(passwordEncoder.encode(contrasenia));
      u.setCorreo(correo);

      e.setUsuario(u);

      System.out.println("LA CONTRASEÑA GENERADA ES: " + contrasenia);

      empleadoService.registrar(e);

      CompletableFuture
          .runAsync(() -> {
            try {
              ServicioCorreo.enviarMensaje(correo,
                  "Tu contraseña para acceder a nuestra plataforma es: " + contrasenia,
                  "Bienvenido al sistema de comandas");
            } catch (Exception e2) {
              e2.printStackTrace();
            }
          });

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
      @RequestParam(value = "cargo", required = false) Optional<Integer> idCargoOptional,
      @RequestParam(value = "correo", required = false) String correo,
      RedirectAttributes redirect) {
    try {

      Empleado e = empleadoService.obtenerxId(id);
      e.setNombre(nombre);
      e.setApellido(apellido);
      e.setDni(dni);
      e.setTelefono(telefono);

      if (idCargoOptional.isPresent()) {
        Cargo cargo = new Cargo();
        cargo.setId(idCargoOptional.get());
        e.setCargo(cargo);
      }

      if (correo != null) {
        e.getUsuario().setCorreo(correo);
      }

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

  @GetMapping(value = { "/verificar-dni/{dni}", "/verificar-dni/{dni}/{cod}" })
  @ResponseBody
  public Map<String, Boolean> verificarDni(@PathVariable String dni,
      @PathVariable(required = false) Optional<Integer> cod) {
    Map<String, Boolean> respuesta = new HashMap<>();
    boolean seEncontro = false;

    if (!cod.isPresent()) {
      seEncontro = empleadoService.obtenerPorDni(dni) != null;
    } else {
      Empleado empleado = empleadoService.obtenerPorDni(dni);
      seEncontro = empleado != null && !empleado.getId().equals(cod.get());
    }

    respuesta.put("isFound", seEncontro);
    return respuesta;
  }

  @GetMapping(value = { "/verificar-correo/{email}", "/verificar-correo/{email}/{cod}" })
  @ResponseBody
  public Map<String, Boolean> verificarEmail(@PathVariable String email,
      @PathVariable(required = false) Optional<Integer> cod) {
    Map<String, Boolean> respuesta = new HashMap<>();
    boolean seEncontro = false;

    if (!cod.isPresent()) {
      seEncontro = usuarioService.obtenerUsuarioPorCorreo(email) != null;
    } else {
      Usuario usuario = usuarioService.obtenerUsuarioPorCorreo(email);
      seEncontro = usuario != null && !usuario.getId().equals(cod.get());
    }

    respuesta.put("isFound", seEncontro);
    return respuesta;
  }

  @GetMapping(value = { "/verificar-telefono/{telefono}", "/verificar-telefono/{telefono}/{cod}" })
  @ResponseBody
  public Map<String, Boolean> verificarTelephone(@PathVariable String telefono,
      @PathVariable(required = false) Optional<Integer> cod) {
    Map<String, Boolean> respuesta = new HashMap<>();
    boolean seEncontro = false;

    if (!cod.isPresent()) {
      seEncontro = empleadoService.obtenerPorTelefono(telefono) != null;
    } else {
      Empleado empleado = empleadoService.obtenerPorTelefono(telefono);
      seEncontro = empleado != null && !empleado.getId().equals(cod.get());
    }

    respuesta.put("isFound", seEncontro);
    return respuesta;
  }
}
