package com.proyecto.utils;

public class Utilidades {
	public static int generarNumeroRandom(int min, int max) {		
		return (int) (Math.round(Math.random() * (max - min)) + min);
	}
}
