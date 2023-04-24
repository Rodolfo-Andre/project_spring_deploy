package com.proyecto.controller;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.proyecto.service.MesaService;


@Controller
@RequestMapping(value = "Mesa")
public class MesaController {
	@Autowired
	MesaService mesaServices;
	
	
	
	@GetMapping(value = "/")
	  public String index(Model model) {
		model.addAttribute("listaMesas", mesaServices.getAll());
		return "pages/mesas";
	  }

}
