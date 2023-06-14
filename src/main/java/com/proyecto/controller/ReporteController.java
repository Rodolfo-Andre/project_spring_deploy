package com.proyecto.controller;

import java.util.*;
import java.io.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.ResourceUtils;
import org.springframework.web.bind.annotation.*;
import com.proyecto.entity.*;
import com.proyecto.entity.dto.*;
import com.proyecto.service.ComprobanteService;
import com.proyecto.service.DetalleComandaService;
import jakarta.servlet.http.HttpServletResponse;
import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;

@Controller
@RequestMapping("reportes")
public class ReporteController {
  @Autowired
  ComprobanteService comprobanteService;
  @Autowired
  DetalleComandaService detalleService;

  @RequestMapping(value = "")
  public String lista() {
    return "pages/reporte";
  }

  @GetMapping(value = "/reporte-cdp")
  public void reporte(HttpServletResponse response, @RequestParam("id") int id) {
    try {
      Comprobante comprobante = comprobanteService.findById(id);
      List<DetalleComanda> lista = comprobante.getComanda().getListaDetalleComanda();
      File file = ResourceUtils.getFile("classpath:CDP_ciclo5.jrxml");
      JasperReport jasper = JasperCompileManager.compileReport(file.getAbsolutePath());

      JRBeanCollectionDataSource ds = new JRBeanCollectionDataSource(lista);
      Map<String, Object> parameters = new HashMap<>();
      parameters.put("tipoCDP", comprobante.getTipoComprobante().getTipo());
      parameters.put("ruc", comprobante.getCaja().getEstablecimiento().getRuc());
      parameters.put("idCDP", comprobante.getId());
      parameters.put("nombreEstablecimiento", comprobante.getCaja().getEstablecimiento().getNombre());
      parameters.put("telefono", comprobante.getCaja().getEstablecimiento().getTelefono());
      parameters.put("direccion", comprobante.getCaja().getEstablecimiento().getDireccion());
      parameters.put("nombreCliente", comprobante.getCliente().getNombre());
      parameters.put("dni", comprobante.getCliente().getDni());
      parameters.put("fechaEmision", comprobante.getFechaEmision());
      parameters.put("metodo", comprobante.getListaDetalleComprobante().get(0).getMetodoPago().getMetodo());
      parameters.put("nombreCargo", comprobante.getEmpleado().getCargo().getNombre());
      parameters.put("nombreEmpleado", comprobante.getEmpleado().getNombre());
      parameters.put("subTotal", comprobante.getSubTotal());
      parameters.put("igv", comprobante.getIgv());
      parameters.put("descuento", comprobante.getDescuento());
      parameters.put("precioTotalPedido", comprobante.getPrecioTotalPedido());
      parameters.put("logoPrincipal", "classpath:/static/images/logo.jpg");
      parameters.put("logoDireccion", "classpath:/static/images/direccion.jpg");
      parameters.put("logoRuc", "classpath:/static/images/ruc.png");
      parameters.put("logoTelefono", "classpath:/static/images/telefono.jpg");
      parameters.put("logoUsuario", "classpath:/static/images/usuario.png");

      JasperPrint jasperPrint = JasperFillManager.fillReport(jasper, parameters, ds);
      response.setContentType("application/pdf");
      OutputStream salida = response.getOutputStream();
      JasperExportManager.exportReportToPdfStream(jasperPrint, salida);

    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  @GetMapping("/reporte-ventas")
  @ResponseBody
  public List<ReporteVentas> reportePorDiasMasVendido() {
    List<Object[]> datos = comprobanteService.generarReporte();
    List<ReporteVentas> listaReporteVentas = new ArrayList<>();

    for (Object[] result : datos) {
      ReporteVentas reporteVentas = new ReporteVentas();
      reporteVentas.setFechaEmision((String) result[1]);
      reporteVentas.setqRecaudada((double) result[2]);
      reporteVentas.setqComprobante(Integer.parseInt(result[3].toString()));
      reporteVentas.setqPlatos(Integer.parseInt(result[4].toString()));
      reporteVentas.setPlatoMasVendido((String) result[5]);

      listaReporteVentas.add(reporteVentas);
    }

    return listaReporteVentas;
  }

  @GetMapping("/reporte-plato")
  @ResponseBody
  public List<ReportePlatoVendido> reportePorplatomasvendido() {
    List<Object[]> datos = detalleService.generarReportePlato();
    List<ReportePlatoVendido> listaReportePlatoVendidos = new ArrayList<>();

    for (Object[] result : datos) {
      ReportePlatoVendido reportePlatoVendido = new ReportePlatoVendido();
      reportePlatoVendido.setCodplato((String) result[0]);
      reportePlatoVendido.setNomPlato((String) result[1]);
      reportePlatoVendido.setNomCat((String) result[2]);
      reportePlatoVendido.setTotalsale((double) result[3]);
      reportePlatoVendido.setCantPedido(Integer.parseInt(result[4].toString()));

      listaReportePlatoVendidos.add(reportePlatoVendido);
    }

    return listaReportePlatoVendidos;
  }
}
