package com.proyecto.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.proyecto.entity.Cargo;
import com.proyecto.service.CargoService;

@Controller
@RequestMapping(value = "/configuracion/cargo")
public class CargoController {

    @Autowired
    CargoService cargoService;

    @GetMapping(value = "/obtener")
    @ResponseBody
    public List<Cargo> obtenerTodo() {
        return cargoService.obtenerTodo();
    }

}
