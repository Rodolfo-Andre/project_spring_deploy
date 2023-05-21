package com.proyecto.controller;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.proyecto.entity.Cargo;
import com.proyecto.entity.Empleado;
import com.proyecto.entity.Usuario;
import com.proyecto.service.EmpleadoService;

@Controller
@RequestMapping(value = "/configuracion/empleado")
public class EmpleadoController {

    @Autowired
    EmpleadoService empleadoService;

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
            RedirectAttributes redict) {
        try {
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

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
            redict.addFlashAttribute("Mensaje", "Empleado agregado correctamente");

        } catch (Exception e) {
            e.printStackTrace();
            redict.addFlashAttribute("Mensaje", "Error al agregar empleado");
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
            RedirectAttributes redict) {
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
            redict.addFlashAttribute("Mensaje", "Empleado actualizado correctamente");

        } catch (Exception e) {
            e.printStackTrace();
            redict.addFlashAttribute("Mensaje", "Error al actualizar empleado");
        }
        return "redirect:/configuracion/empleado";
    }

    @PostMapping(value = "/eliminar")
    public String eliminar(RedirectAttributes redirect, @RequestParam("id") int id) {
        try {
            empleadoService.eliminar(id);
            redirect.addFlashAttribute("Mensaje", "Empleado eliminado correctamente");
        } catch (Exception e) {
            e.printStackTrace();
            redirect.addFlashAttribute("Mensaje", "Error al eliminar");
        }

        return "redirect:/configuracion/empleado";
    }

}
