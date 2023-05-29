package com.proyecto.entity;

public class PlatoComanda {

    private String id;

    private int cantidad;

    public PlatoComanda() {
    }

    public PlatoComanda(String id, int cantidad) {
        this.id = id;
        this.cantidad = cantidad;
    }

    public String getId() {
        return this.id;
    }

    public int getCantidad() {
        return this.cantidad;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setCantidad(int cantidad) {
        this.cantidad = cantidad;
    }

}
