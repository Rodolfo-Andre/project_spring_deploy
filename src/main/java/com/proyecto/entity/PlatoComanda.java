package com.proyecto.entity;

public class PlatoComanda {

    private String id;

    private int cantidad;

    private String observacion;

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

    public String getObservacion() {
        return this.observacion;
    }

    public void setObservacion(String Observacion) {
        this.observacion = Observacion;
    }

}
