package com.proyecto.controller;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.proyecto.entity.Empleado;
import com.proyecto.service.EmpleadoService;

@Controller
@RequestMapping(value = "Empleados")
public class EmpleadoController {

    @Autowired
    EmpleadoService empleadoService;

    @GetMapping(value = "obtener/{id}")
    @ResponseBody
    public Empleado buscarPorId(@PathVariable Integer id, Model model) {
        return empleadoService.obtenerxId(id);
    }

    @RequestMapping(value = "/registrar")
    public String registrar(@RequestParam("nameEmpleado") String nombre,
            @RequestParam("lastnameEmpleado") String apellido,
            @RequestParam("telefono") String telefono,
            @RequestParam("Dni") String dni,
            @RequestParam("Cargo") int cargo,
            @RequestParam("Fecha") Date fecha,
            RedirectAttributes redict) {
        try {
            Empleado e = new Empleado();
            e.setNombre(nombre);
            e.setApellido(apellido);
            e.setDni(dni);

        } catch (Exception e) {
            // TODO: handle exception
        }
        return dni;
    }

}
