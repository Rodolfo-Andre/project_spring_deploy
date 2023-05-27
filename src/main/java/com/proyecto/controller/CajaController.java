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

import com.proyecto.entity.Caja;

import com.proyecto.entity.Establecimiento;

import com.proyecto.service.CajaService;
import com.proyecto.service.EstablecimientoService;


@Controller
@RequestMapping(value="configuracion/caja")
public class CajaController {
	@Autowired
	CajaService cajaservice;
	
	@Autowired 
	EstablecimientoService establecimientoService;
	
	@GetMapping(value="")
	public String index(Model model) {
		model.addAttribute("listaCaja", cajaservice.obtenerTodo());
		return "pages/caja";
	}
	
	
	  @PostMapping(value = "/grabar")
	  public String grabar(RedirectAttributes redirect) {
	    try {
	    	
	      Caja caja = new Caja();
	               
	      caja.setEstablecimiento(establecimientoService.obtenerPrimero());
	      
	      cajaservice.agregar(caja);
	      
	      redirect.addFlashAttribute("Mensaje", "Caja agregado correctamente");
	    } catch (Exception e) {
	      e.printStackTrace();
	      redirect.addFlashAttribute("Mensaje", "Error al agregar");
	    }

	    return "redirect:/configuracion/caja";
	  }
	  
	  @PostMapping(value = "/eliminar")
	  public String eliminar(RedirectAttributes redirect, @RequestParam("id") String id) {
	    try {
	      cajaservice.eliminar(id);
	      redirect.addFlashAttribute("Mensaje", "Caja eliminado correctamente");
	    } catch (Exception e) {
	      e.printStackTrace();
	      redirect.addFlashAttribute("Mensaje", "Error al eliminar");
	    }

	    return "redirect:/configuracion/caja";
	  }
	  
}
