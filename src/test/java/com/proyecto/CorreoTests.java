package com.proyecto;

import java.util.concurrent.CompletableFuture;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import com.proyecto.utils.ServicioCorreo;

@SpringBootTest
class CorreoTests {
  // @Test
  void enviarMensaje() {
    CompletableFuture<Void> completableFuture = CompletableFuture
        .runAsync(() -> {
          try {
            ServicioCorreo.enviarMensaje("rcaballerov_10@outlook.com ", "hola", "aaaaa");
          } catch (Exception e) {
            e.printStackTrace();
          }
        });

    System.out.println("Haciendo otras cosas mientras se envia el mensaje");
  }
}
