package com.proyecto.controller;

import java.util.*;
import java.util.concurrent.CompletableFuture;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import com.proyecto.entity.Usuario;
import com.proyecto.service.UsuarioService;
import com.proyecto.utils.*;

@Controller
@RequestMapping(value = "/login")
public class SesionController {
  @Autowired
  UsuarioService usuarioService;

  @Autowired
  PasswordEncoder passwordEncoder;

  @GetMapping(value = "")
  public String login() {
    return "pages/login";
  }

  @PostMapping(value = "/verificar-correo")
  @ResponseBody
  public Map<String, Boolean> verificarCorreo(@RequestBody Map<String, Object> request) {
    String email = request.get("email").toString();
    Usuario usuario = usuarioService.obtenerUsuarioPorCorreo(email);
    boolean esCorrecto = usuario != null;
    Map<String, Boolean> respuesta = new HashMap<>();

    if (esCorrecto) {
      Map<String, Object> parametros = new HashMap<>();
      parametros.put("email", email);
      enviarCodigo(parametros);
    }

    respuesta.put(("isCorrect"), esCorrecto);
    return respuesta;
  }

  @PostMapping(value = "/enviar-codigo")
  @ResponseBody
  public Map<String, Object> enviarCodigo(@RequestBody Map<String, Object> request) {
    Usuario usuario = usuarioService.obtenerUsuarioPorCorreo(request.get("email").toString());

    Map<String, Object> respuesta = new HashMap<>();

    if (usuario == null) {
      respuesta.put("error", "Usuario no encontrado");
      return respuesta;
    }

    int codigo = Utilidades.generarNumeroRandom(1000, 9000);

    CompletableFuture
        .runAsync(() -> {
          try {
            ServicioCorreo.enviarMensaje(usuario.getCorreo(),
                "Tu código de verificación es: " + codigo, "Código de Verificaión");
          } catch (Exception e) {

            e.printStackTrace();
          }
        });

    System.out.println("Tu código es" + codigo);

    usuario.setCodigo(codigo);
    usuarioService.actualizar(usuario);

    respuesta.put("sent", true);
    return respuesta;
  }

  @PostMapping(value = "/verificar-codigo")
  @ResponseBody
  public Map<String, Boolean> verificarCodigo(
      @RequestBody Map<String, Object> request) {
    Usuario usuario = usuarioService.obtenerUsuarioPorCorreo(request.get("email").toString());
    int codigo = Integer.parseInt(request.get("code").toString());
    boolean esCorrecto = codigo == usuario.getCodigo();

    if (esCorrecto) {
      usuario.setCodigo(0);
      usuarioService.actualizar(usuario);
    }

    Map<String, Boolean> respuesta = new HashMap<>();
    respuesta.put(("isCorrect"), esCorrecto);
    return respuesta;
  }

  @PostMapping(value = "/cambiar-contrasena")
  @ResponseBody
  public Map<String, Boolean> cambiarContrasena(@RequestBody Map<String, Object> request) {
    String email = request.get("email").toString();
    String password = request.get("password").toString();
    String passwordEncoded = passwordEncoder.encode(password);
    Usuario usuario = usuarioService.obtenerUsuarioPorCorreo(email);

    usuario.setContrasena(passwordEncoded);

    usuarioService.actualizar(usuario);

    Map<String, Boolean> respuesta = new HashMap<>();
    respuesta.put("isCorrect", true);
    return respuesta;
  }
}
