package com.proyecto.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.proyecto.entity.BaseDataInput;
import com.proyecto.entity.CheckStatus;
import com.proyecto.entity.Comanda;
import com.proyecto.entity.DeleteDetalleComandaInput;
import com.proyecto.entity.DetalleComanda;
import com.proyecto.entity.Empleado;
import com.proyecto.entity.EstadoComanda;
import com.proyecto.entity.Mesa;
import com.proyecto.entity.Plato;
import com.proyecto.entity.PlatoComanda;
import com.proyecto.service.ComandaService;
import com.proyecto.service.DetalleComandaService;
import com.proyecto.service.MesaService;
import com.proyecto.service.PlatoService;

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

    @GetMapping(value = "/listar")
    @ResponseBody
    public List<Comanda> Listar() {
        List<Comanda> listaComandas = comandaService.obtenerTodo();

        // List<Comanda> lista = comandaService.obtenerTodo();
        // return lista;
        return listaComandas;
    }

    @GetMapping(value = "/detalle/{id}")
    public String Detalle(@PathVariable(value = "id", required = false) int id, Model model) {
        Mesa mesa = mesaService.obtenerPorId(id);
        model.addAttribute("mesa", mesa);

        if (mesa.getEstado().equals("Libre")) {
            List<Comanda> listaComandas = comandaService.obtenerTodo();
            int idComanda = listaComandas.get(listaComandas.size() - 1).getId() + 1;
            model.addAttribute("idComanda", idComanda);
        } else {
            Comanda comanda = comandaService.obtenerTodo().stream().filter(c -> c.getMesa().getId() == id).findFirst()
                    .orElse(null);
            if (comanda != null) {
                model.addAttribute("comanda", comanda);
            }
        }

        return "pages/detalle-comanda";
    }

    @PostMapping(value = "/registrar")
    public ResponseEntity<Map<String, String>> Guardar(
            @RequestBody BaseDataInput baseData,
            RedirectAttributes redirect

    ) {
        String mensaje = "";
        String status = "success";
        try {
            CheckStatus statusPlatos = verificarSiExistePlatos(baseData.getListaPlatos());

            if (statusPlatos.getStatus().equals(CheckStatus.StatusError)) {
                mensaje = statusPlatos.getMensaje();
                status = statusPlatos.getStatus();
                return ResponseEntity.ok().body(Map.of("mensaje", mensaje, "status", status));
            }
            if (baseData.getId() == 0) {

                Mesa mesa = mesaService.obtenerPorId(baseData.getNumeroMesa());
                if (mesa.getEstado().equals("Ocupado")) {
                    mensaje = "Error! La mesa ya esta ocupada";
                    status = CheckStatus.StatusError;
                    return ResponseEntity.ok().body(Map.of("mensaje", mensaje, "status", status));

                }

                Comanda comanda = new Comanda();
                comanda.setCantidadAsientos(baseData.getCantidadPersonas());
                comanda.setPrecioTotal(baseData.getPrecioTotal());
                comanda.setMesa(mesa);

                EstadoComanda estadoComanda = new EstadoComanda();
                estadoComanda.setId(2);
                comanda.setEstadoComanda(estadoComanda);

                Empleado empleado = new Empleado();
                empleado.setId(1);
                comanda.setEmpleado(empleado);

                Comanda comandaGuardado = comandaService.agregar(comanda);

                List<DetalleComanda> listaDetalleComanda = new ArrayList<>();
                for (PlatoComanda platoC : baseData.getListaPlatos()) {
                    DetalleComanda detalleComanda = new DetalleComanda();

                    Plato plato = platoService.obtenerPorId(platoC.getId());
                    detalleComanda.setPlato(plato);
                    detalleComanda.setCantidadPedido(platoC.getCantidad());
                    detalleComanda.setPrecioUnitario(plato.getPrecioPlato());
                    detalleComanda.setComanda(comandaGuardado);

                    listaDetalleComanda.add(detalleComanda);

                    detalleComandaService.registrar(detalleComanda);

                }

                comandaGuardado.setListaDetalleComanda(listaDetalleComanda);

                comandaService.actualizar(comandaGuardado);

                mesa.setEstado("Ocupado");
                mesaService.actualizar(mesa);

                mensaje = "Comanda registrada correctamente";
                status = "success";
            } else {
                Comanda comanda = comandaService.obtenerPorId(baseData.getId());
                comanda.setPrecioTotal(baseData.getPrecioTotal());

                for (PlatoComanda platoC : baseData.getListaPlatos()) {
                    DetalleComanda detalleComanda = new DetalleComanda();
                    detalleComanda = detalleComandaService.findByComandaId(comanda.getId(), platoC.getId());

                    if (detalleComanda == null) {
                        detalleComanda = new DetalleComanda();
                        Plato plato = platoService.obtenerPorId(platoC.getId());
                        detalleComanda.setPlato(plato);
                        detalleComanda.setCantidadPedido(platoC.getCantidad());
                        detalleComanda.setPrecioUnitario(plato.getPrecioPlato());
                        detalleComanda.setComanda(comanda);

                        detalleComandaService.registrar(detalleComanda);
                        comanda.getListaDetalleComanda().add(detalleComanda);

                    } else {
                        detalleComanda.setCantidadPedido(platoC.getCantidad());
                        detalleComandaService.actualizar(detalleComanda);
                    }

                }
                comandaService.actualizar(comanda);

                mensaje = "Comanda actualizada correctamente";
                status = "success";

            }

        } catch (Exception e) {
            mensaje = "Error al registrar la comanda";
            status = "error";

        }

        return ResponseEntity.ok().body(Map.of("mensaje", mensaje, "status", status));
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
            comandaService.eliminar(id);
            redirect.addFlashAttribute("mensaje", "Comanda eliminado correctamente");
            redirect.addFlashAttribute("tipo", "success");
        } catch (Exception e) {
            e.printStackTrace();
            redirect.addFlashAttribute("mensaje", "Error al eliminar Comanda");
            redirect.addFlashAttribute("tipo", "error");
        }

        return "redirect:/configuracion/comanda";
    }


    @PostMapping (value = "/eliminar-comanda")
    public ResponseEntity<Map<String, String>> eliminarComanda(@RequestBody DeleteDetalleComandaInput input) {
        String mensaje = "";
        String status = "success";
        try {
            DetalleComanda detalleComanda = detalleComandaService.findDetalleComandaByPlatoIdAndComandaId(input.platoID, input.comandaID);
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
}
