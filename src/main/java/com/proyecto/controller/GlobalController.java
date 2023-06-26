package com.proyecto.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;
import com.proyecto.entity.GlobalVariables;
import com.proyecto.service.EstablecimientoService;

@ControllerAdvice
public class GlobalController {
  @Autowired
  private EstablecimientoService establecimientoService;

  @Autowired
  private GlobalVariables globalVariables;

  @ModelAttribute
  public void setGlobalVariables() {
    globalVariables.setEstablecimiento(establecimientoService.obtenerPrimero());
  }
}
