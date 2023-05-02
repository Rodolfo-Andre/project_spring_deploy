package com.proyecto.utils;

import java.io.*;
import java.util.*;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

public class ServicioImagen {
  private static Cloudinary cloudinary;

  private ServicioImagen() {
  }

  public static Cloudinary obtenerCloudinary() {
    if (cloudinary != null) {
      return cloudinary;
    }

    return inicializarCloudinary();
  }

  private static Cloudinary inicializarCloudinary() {
    Map<String, String> config = new HashMap<>();

    config.put("cloud_name", "dpfhjk0sw");
    config.put("api_key", "677482395587164");
    config.put("api_secret", "rpB2BFR5Yz4grNo0bUKxouwIsE4");

    return new Cloudinary(config);
  }

  public static Map subirImagen(byte[] bytes) {
    Cloudinary cloudinary = obtenerCloudinary();
    Map respuesta = ObjectUtils.emptyMap();

    try {
      Map<String, Object> parametros = new HashMap<>();
      parametros.put("folder", "platos");
      parametros.put("resource_type", "image");
      parametros.put("format", "jpg");

      respuesta = cloudinary.uploader().upload(
          bytes,
          parametros);

    } catch (IOException e) {
      e.printStackTrace();
    }

    return respuesta;
  }
}
