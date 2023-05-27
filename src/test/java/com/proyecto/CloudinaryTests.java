package com.proyecto;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import com.cloudinary.Cloudinary;
import com.proyecto.utils.ServicioImagen;

@SpringBootTest
class CloudinaryTests {
  //@Test
  void subirImagen() {
    Cloudinary cloudinary = ServicioImagen.obtenerCloudinary();

    try {
      Map<String, Object> parametros = new HashMap<String, Object>();
      parametros.put("folder", "platos");
      parametros.put("resource_type", "image");
      parametros.put("format", "jpg");

      Map respuesta = cloudinary.uploader().upload("https://i.redd.it/gofamdij6r661.png",
          parametros);

      assertNotNull(respuesta, "La respuesta no debe ser nula");
    } catch (IOException e) {
      e.printStackTrace();
    }
  }
}
