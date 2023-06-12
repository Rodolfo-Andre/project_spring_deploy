package com.proyecto.controller;

import java.text.SimpleDateFormat;
import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import com.proyecto.entity.*;
import com.proyecto.interfaces.UsuarioActual;
import com.proyecto.service.*;

@Controller
@RequestMapping(value = "/configuracion/comanda")
public class ComandaController {
  @Autowired
  ComandaService comandaService;
  @Autowired
  MesaService mesaService;
  @Autowired
  PlatoService platoService;
  @Autowired
  DetalleComandaService detalleComandaService;
  @Autowired
  EmpleadoService empleadoService;

  @GetMapping(value = "")
  public String index(Model model) {
    List<Mesa> mesas = mesaService.obtenerTodo();

    model.addAttribute("mesas", mesas);
    return "pages/comanda";
  }

  @GetMapping(value = "/obtener/{id}")
  @ResponseBody
  public Comanda buscarPorId(@PathVariable Integer id) {
    Comanda comanda = comandaService.findByMesaId(id);
    return comanda;
  }

  @GetMapping(value = "/obtener-listado/{id}")
  @ResponseBody
  public List<DetalleComanda> getDetallesById(@PathVariable Integer id) {
    List<DetalleComanda> detalles = detalleComandaService.findByComandaId(id);
    return detalles;
  }

  @GetMapping(value = "/comanda-libre/{id}")
  @ResponseBody
  public Comanda obtenerComandaLibre(@PathVariable Integer id) {
    List<Comanda> listaComandas = comandaService.obtenerTodo();
    Comanda comandaDeseada = listaComandas.stream()
        .filter(comanda -> comanda.getMesa().getId() == id && !comanda.getEstadoComanda().getEstado().equals("Pagado"))
        .findFirst()
        .orElse(null);

    return comandaDeseada;
  }

  @GetMapping(value = "/listar")
  @ResponseBody
  public List<Comanda> listar() {
    List<Comanda> listaComandas = comandaService.obtenerTodo();
    return listaComandas;
  }

  @GetMapping(value = "/detalle/{id}")
  public String detalleComanda(@PathVariable(value = "id", required = false) int id, Model model,
      @UsuarioActual UsuarioDetallesCustom usuario) {
    Mesa mesa = mesaService.obtenerPorId(id);

    if (mesa == null) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Mesa no encontrada");
    }

    if (mesa.getEstado().equals("Libre") && !List.of("ROLE_ADMINISTRADOR", "ROLE_MESERO", "ROLE_CAJERO")
        .contains(usuario.getUsuario().getEmpleado().getCargo().getNombre())) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Comanda no encontrada");
    }

    model.addAttribute("mesa", mesa);

    if (mesa.getEstado().equals("Libre")) {
      List<Comanda> listaComandas = comandaService.obtenerTodo();
      int idComanda = listaComandas.isEmpty() ? 1 : listaComandas.get(listaComandas.size() - 1).getId() + 1;

      model.addAttribute("idComanda", idComanda);
    } else {
      Comanda comanda = comandaService.obtenerTodo().stream()
          .filter(c -> c.getMesa().getId() == id && !c.getEstadoComanda().getEstado().equals("Pagado")).findFirst()
          .orElse(null);
      if (comanda != null) {
        model.addAttribute("comanda", comanda);
      }
    }

    return "pages/detalle-comanda";
  }

  @PostMapping(value = "/registrar")
  public ResponseEntity<Map<String, String>> guardar(
      @RequestBody BaseDataInput baseData,
      RedirectAttributes redirect) {
    try {
      CheckStatus statusPlatos = verificarSiExistePlatos(baseData.getListaPlatos());
      Mesa mesa = mesaService.obtenerPorId(baseData.getNumeroMesa());

      if (statusPlatos.getStatus().equals(CheckStatus.StatusError)) {
        return ResponseEntity.ok()
            .body(Map.of("mensaje", statusPlatos.getMensaje(), "status", statusPlatos.getStatus()));
      }

      if (mesa.getEstado().equals("Libre")) {
        return registrarNuevaComanda(baseData);
      } else {
        return actualizarComandaExistente(baseData);
      }
    } catch (Exception e) {
      String mensaje = "Error al registrar la comanda";
      String status = "error";
      return ResponseEntity.ok().body(Map.of("mensaje", mensaje, "status", status));
    }
  }

  private ResponseEntity<Map<String, String>> registrarNuevaComanda(BaseDataInput baseData) {
    Mesa mesa = mesaService.obtenerPorId(baseData.getNumeroMesa());
    if (mesa.getEstado().equals("Ocupado")) {
      String mensaje = "Error! La mesa ya está ocupada";
      String status = CheckStatus.StatusError;
      return ResponseEntity.ok().body(Map.of("mensaje", mensaje, "status", status));
    }

    Comanda comanda = new Comanda();
    comanda.setId(baseData.getId());
    comanda.setCantidadAsientos(baseData.getCantidadPersonas());
    comanda.setPrecioTotal(baseData.getPrecioTotal());
    comanda.setMesa(mesa);

    EstadoComanda estadoComanda = new EstadoComanda();
    estadoComanda.setId(1);
    comanda.setEstadoComanda(estadoComanda);

    Empleado empleado = empleadoService.findEmpleadoByIdUsario(baseData.idUsuario);
    comanda.setEmpleado(empleado);
    Date date = new Date();

    SimpleDateFormat dateFormat = new SimpleDateFormat("d/MM/yyyy");
    String formattedDate = dateFormat.format(date);
    formattedDate.toString();

    comanda.setFechaEmision(formattedDate);

    Comanda comandaGuardado = comandaService.agregar(comanda);

    List<DetalleComanda> listaDetalleComanda = new ArrayList<>();
    for (PlatoComanda platoC : baseData.getListaPlatos()) {
      DetalleComanda detalleComanda = crearDetalleComanda(platoC, comandaGuardado);
      listaDetalleComanda.add(detalleComanda);
    }

    comandaGuardado.setListaDetalleComanda(listaDetalleComanda);
    comandaService.actualizar(comandaGuardado);

    mesa.setEstado("Ocupado");
    mesaService.actualizar(mesa);

    String mensaje = "Comanda registrada correctamente";
    String status = "success";
    return ResponseEntity.ok().body(Map.of("mensaje", mensaje, "status", status));
  }

  private ResponseEntity<Map<String, String>> actualizarComandaExistente(BaseDataInput baseData) {
    Comanda comanda = comandaService.obtenerPorId(baseData.getId());

    if (comanda.getEstadoComanda().getId() == 3) {

      String mensaje = "Error! La comanda ya está cerrada";
      String status = CheckStatus.StatusError;
      return ResponseEntity.ok().body(Map.of("mensaje", mensaje, "status", status));
    }

    comanda.setPrecioTotal(baseData.getPrecioTotal());
    comanda.setCantidadAsientos(baseData.getCantidadPersonas());

    for (DetalleComanda dComanda : comanda.getListaDetalleComanda()) {
      detalleComandaService.eliminar(dComanda.getId());
    }

    List<DetalleComanda> listaDetalleComanda = new ArrayList<>();
    for (PlatoComanda platoC : baseData.getListaPlatos()) {
      DetalleComanda detalleComanda = crearDetalleComanda(platoC, comanda);
      listaDetalleComanda.add(detalleComanda);
    }

    comanda.setListaDetalleComanda(listaDetalleComanda);
    comandaService.actualizar(comanda);

    String mensaje = "Comanda actualizada correctamente";
    String status = "success";
    return ResponseEntity.ok().body(Map.of("mensaje", mensaje, "status", status));
  }

  private DetalleComanda crearDetalleComanda(PlatoComanda platoC, Comanda comanda) {
    DetalleComanda detalleComanda = new DetalleComanda();
    Plato plato = platoService.obtenerPorId(platoC.getId());
    detalleComanda.setPlato(plato);
    // SSA
    detalleComanda.setObservacion(platoC.getObservacion());
    detalleComanda.setCantidadPedido(platoC.getCantidad());
    detalleComanda.setPrecioUnitario(plato.getPrecioPlato());
    detalleComanda.setComanda(comanda);
    detalleComandaService.registrar(detalleComanda);
    return detalleComanda;
  }

  private CheckStatus verificarSiExistePlatos(List<PlatoComanda> listaPlatos) {
    CheckStatus checkStatus = new CheckStatus(CheckStatus.StatusSuccess, "Todos los platos existen");

    for (PlatoComanda plato : listaPlatos) {
      if (platoService.obtenerPorId(plato.getId()) == null) {
        checkStatus.setStatus(CheckStatus.StatusError);
        checkStatus.setMensaje("Error! El plato " + plato + " no existe");

        break;
      }
    }
    return checkStatus;

  }

  @PostMapping(value = "/eliminar")
  public String eliminar(RedirectAttributes redirect, @RequestParam("id") int id) {
    try {
      Comanda comanda = comandaService.obtenerPorId(id);

      if (comanda == null) {
        redirect.addFlashAttribute("mensaje", "Error! La comanda no existe");
        redirect.addFlashAttribute("tipo", "error");
        return "redirect:/configuracion/comanda";
      }

      if (comanda.getEstadoComanda().getId() == 2) {
        redirect.addFlashAttribute("mensaje", "Error! La comanda ya está Preparada");
        redirect.addFlashAttribute("tipo", "error");
        return "redirect:/configuracion/comanda";
      }

      for (DetalleComanda dComanda : comanda.getListaDetalleComanda()) {

        detalleComandaService.eliminar(dComanda.getId());

      }

      comandaService.eliminar(comanda.getId());

      Mesa mesa = comanda.getMesa();
      mesa.setEstado("Libre");
      mesaService.actualizar(mesa);

      redirect.addFlashAttribute("mensaje", "Comanda eliminado correctamente");
      redirect.addFlashAttribute("tipo", "success");
    } catch (Exception e) {
      e.printStackTrace();
      redirect.addFlashAttribute("mensaje", "Error al eliminar Comanda");
      redirect.addFlashAttribute("tipo", "error");
    }

    return "redirect:/configuracion/comanda";
  }

  @PostMapping(value = "/eliminar-comanda")
  public ResponseEntity<Map<String, String>> eliminarComanda(@RequestBody DeleteDetalleComandaInput input) {
    String mensaje = "";
    String status = "success";
    try {
      DetalleComanda detalleComanda = detalleComandaService.findDetalleComandaByPlatoIdAndComandaId(input.platoID,
          input.comandaID);
      if (detalleComanda == null) {
        mensaje = "Error! El detalle comanda no existe";
        status = "error";
        return ResponseEntity.ok().body(Map.of("mensaje", mensaje, "status", status));
      }

      detalleComandaService.eliminar(detalleComanda.getId());

      mensaje = "Detalle Comanda eliminada correctamente";
      status = "success";
    } catch (Exception e) {
      e.printStackTrace();
      mensaje = "Error al eliminar el Detalle Comanda";
      status = "NOT_FOUND";
    }

    return ResponseEntity.ok().body(Map.of("mensaje", mensaje, "status", status));
  }

  @PostMapping(value = "/preparar-comanda/{id}")
  public ResponseEntity<Map<String, String>> prepararComanda(@PathVariable int id) {
    String mensaje = "Comanda actualizada correctamente";
    String status = "success";

    try {
      Comanda comanda = comandaService.obtenerPorId(id);

      if (comanda == null) {
        mensaje = "Error! La comanda no existe";
        status = "error";

        return ResponseEntity.ok().body(Map.of("mensaje", mensaje, "status", status));
      }

      if (comanda.getEstadoComanda().getEstado().equals("Pagado")) {
        mensaje = "Error! La comanda ya está pagada";
        status = "error";

        return ResponseEntity.ok().body(Map.of("mensaje", mensaje, "status", status));
      }

      EstadoComanda estadoComanda = new EstadoComanda();
      estadoComanda.setId(2);

      comanda.setEstadoComanda(estadoComanda);
      comandaService.actualizar(comanda);
    } catch (Exception e) {
      e.printStackTrace();
      mensaje = "Error al actualizar comanda";
      status = "error";
    }

    return ResponseEntity.ok().body(Map.of("message", mensaje, "status", status));
  }
}
