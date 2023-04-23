package com.proyecto.utils;

import java.util.Random;

public  class Utilidades {
  private Utilidades() {}

  public static int generarNumeroRandom(int desde, int hasta) {	
		return new Random().nextInt(desde, hasta);
	}
}
