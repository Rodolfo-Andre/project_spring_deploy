package com.proyecto.utils;

import java.util.Random;

public class Utilidades {
  private Utilidades() {
  }

  public static final double IGV = 0.18;

  public static int generarNumeroRandom(int min, int max) {
    return new Random().nextInt(min, max);
  }
}
