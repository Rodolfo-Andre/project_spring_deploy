package com.proyecto.db;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import com.proyecto.entity.*;
import com.proyecto.service.*;

@Component
public class DatabaseLoader implements CommandLineRunner {
  @Autowired
  private UsuarioService usuarioService;
  @Autowired
  private CargoService cargoService;
  @Autowired
  private MetodoPagoService metodoPagoService;
  @Autowired
  private CategoriaPlatoService categoriaPlatoService;
  @Autowired
  private EstadoComandaService estadoComandaService;
  @Autowired
  private TipoComprobanteService tipoComprobanteService;
  @Autowired
  private EstablecimientoService establecimientoService;
  @Autowired
  private ClienteService clienteService;
  @Autowired
  private PasswordEncoder passwordEncoder;

  @Override
  public void run(String... args) throws Exception {
    if (establecimientoService.obtenerTamano() == 0) {
      Establecimiento establecimiento = new Establecimiento();
      establecimiento.setId("ES-01");
      establecimiento.setDireccion("Av.Izaguirre");
      establecimiento.setNombre("Sangunchería Wong");
      establecimiento.setTelefono("942850902");
      establecimiento.setRuc("20509311412");

      establecimientoService.agregar(establecimiento);
    }

    if (cargoService.obtenerTamano() == 0) {
      cargoService.agregar(new Cargo("ROLE_ADMINISTRADOR"));
      cargoService.agregar(new Cargo("ROLE_MESERO"));
      cargoService.agregar(new Cargo("ROLE_CAJERO"));
      cargoService.agregar(new Cargo("ROLE_COCINERO"));
      cargoService.agregar(new Cargo("ROLE_GERENTE"));
    }

    if (metodoPagoService.obtenerTamano() == 0) {
      metodoPagoService.agregar(new MetodoPago("Pago en efectivo"));
      metodoPagoService.agregar(new MetodoPago("BCP"));
      metodoPagoService.agregar(new MetodoPago("BBVA"));
      metodoPagoService.agregar(new MetodoPago("Scotiabank"));
      metodoPagoService.agregar(new MetodoPago("Interbank"));
    }

    if (categoriaPlatoService.obtenerTamano() == 0) {
      categoriaPlatoService.agregar(new CategoriaPlato("CP-01", "Bebidas"));
      categoriaPlatoService.agregar(new CategoriaPlato("CP-02", "Hamburguesas"));
      categoriaPlatoService.agregar(new CategoriaPlato("CP-03", "Postres"));
      categoriaPlatoService.agregar(new CategoriaPlato("CP-04", "Sopas"));
    }

    if (estadoComandaService.obtenerTamano() == 0) {
      estadoComandaService.agregar(new EstadoComanda("Generado"));
      estadoComandaService.agregar(new EstadoComanda("Preparado"));
      estadoComandaService.agregar(new EstadoComanda("Pagado"));
    }

    if (tipoComprobanteService.obtenerTamano() == 0) {
      tipoComprobanteService.agregar(new TipoComprobante("Factura"));
      tipoComprobanteService.agregar(new TipoComprobante("Boleta"));
    }

    if (clienteService.obtenerTamano() == 0) {
      Cliente cliente = new Cliente();
      cliente.setNombre("Cliente");
      cliente.setApellido("");
      cliente.setDni("");

      clienteService.agregar(cliente);
    }

    if (usuarioService.obtenerTamano() == 0) {
      Cargo administrador = cargoService.obtenerPorNombre("ROLE_ADMINISTRADOR");

      Usuario usuarioAdministrador = new Usuario();
      usuarioAdministrador.setCorreo("admin@admin.com");
      usuarioAdministrador.setContrasena(passwordEncoder.encode("admin"));

      Empleado empleadoAdministrador = new Empleado();
      empleadoAdministrador.setNombre("Admin");
      empleadoAdministrador.setApellido("Admin");
      empleadoAdministrador.setDni("77777777");
      empleadoAdministrador.setTelefono("923123123");
      empleadoAdministrador.setUsuario(usuarioAdministrador);
      empleadoAdministrador.setCargo(administrador);

      usuarioAdministrador.setEmpleado(empleadoAdministrador);

      usuarioService.agregar(usuarioAdministrador);

      /* ------------------------------------------------------------- */

      Cargo mesero = cargoService.obtenerPorNombre("ROLE_MESERO");

      Usuario usuarioMesero = new Usuario();
      usuarioMesero.setCorreo("mesero@mesero.com");
      usuarioMesero.setContrasena(passwordEncoder.encode("mesero"));

      Empleado empleadoMesero = new Empleado();
      empleadoMesero.setNombre("Mesero");
      empleadoMesero.setApellido("Mesero");
      empleadoMesero.setDni("66666666");
      empleadoMesero.setTelefono("985737523");
      empleadoMesero.setUsuario(usuarioMesero);
      empleadoMesero.setCargo(mesero);

      usuarioMesero.setEmpleado(empleadoMesero);

      usuarioService.agregar(usuarioMesero);

      /* ------------------------------------------------------------- */

      Cargo cajero = cargoService.obtenerPorNombre("ROLE_CAJERO");

      Usuario usuarioCajero = new Usuario();
      usuarioCajero.setCorreo("cajero@cajero.com");
      usuarioCajero.setContrasena(passwordEncoder.encode("cajero"));

      Empleado empleadoCajero = new Empleado();
      empleadoCajero.setNombre("Cajero");
      empleadoCajero.setApellido("Cajero");
      empleadoCajero.setDni("55555555");
      empleadoCajero.setTelefono("985743657");
      empleadoCajero.setUsuario(usuarioCajero);
      empleadoCajero.setCargo(cajero);

      usuarioCajero.setEmpleado(empleadoCajero);

      usuarioService.agregar(usuarioCajero);

      /* ------------------------------------------------------------- */

      Cargo cocinero = cargoService.obtenerPorNombre("ROLE_COCINERO");

      Usuario usuarioCocinero = new Usuario();
      usuarioCocinero.setCorreo("cocinero@cocinero.com");
      usuarioCocinero.setContrasena(passwordEncoder.encode("cocinero"));

      Empleado empleadoCocinero = new Empleado();
      empleadoCocinero.setNombre("Cocinero");
      empleadoCocinero.setApellido("Cocinero");
      empleadoCocinero.setDni("44444444");
      empleadoCocinero.setTelefono("995845948");
      empleadoCocinero.setUsuario(usuarioCocinero);
      empleadoCocinero.setCargo(cocinero);

      usuarioCocinero.setEmpleado(empleadoCocinero);

      usuarioService.agregar(usuarioCocinero);

      /* ------------------------------------------------------------- */

      Cargo gerente = cargoService.obtenerPorNombre("ROLE_GERENTE");

      Usuario usuarioGerente = new Usuario();
      usuarioGerente.setCorreo("gerente@gerente.com");
      usuarioGerente.setContrasena(passwordEncoder.encode("gerente"));

      Empleado empleadoGerente = new Empleado();
      empleadoGerente.setNombre("Gerente");
      empleadoGerente.setApellido("Gerente");
      empleadoGerente.setDni("33333333");
      empleadoGerente.setTelefono("985684839");
      empleadoGerente.setUsuario(usuarioGerente);
      empleadoGerente.setCargo(gerente);

      usuarioGerente.setEmpleado(empleadoGerente);

      usuarioService.agregar(usuarioGerente);
    }
  }
}
