package com.proyecto.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.proyecto.entity.Mesa;
import com.proyecto.service.MesaService;


@Controller
@RequestMapping(value = "Mesa")
public class MesaController {
	@Autowired
	MesaService mesaServices;
	
	
	
	@GetMapping(value = "/")
	  public String index(Model model) {
		model.addAttribute("listaMesas", mesaServices.getAll());
		model.addAttribute("mesaObjeto", new Mesa());
		return "pages/mesas";
	  }
	
	@GetMapping("/obtener/{id}")
	@ResponseBody
	public Mesa buscarPorId(@PathVariable Integer id,Model model) {
		return mesaServices.obtenerPorId(id);
		
	}
	
	@PostMapping(value = "grabar")
	public String grabar(RedirectAttributes redirect, @RequestParam("quantityChairs") int sillas) {
		try {
			Mesa mesa = new Mesa();
			mesa.setCantidadAsientos(sillas);
			mesa.setEstado("Libre");
			mesaServices.agregar(mesa);
			redirect.addFlashAttribute("Mensaje", "Mesa agregada correctamente");
		} catch (Exception e) {
			e.printStackTrace();
			redirect.addFlashAttribute("Mensaje", "Error al agregar");
		}
		return "redirect:/Mesa/";
	}
	

}
