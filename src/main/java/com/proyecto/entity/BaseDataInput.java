package com.proyecto.entity;

import java.util.List;

public class BaseDataInput {

    private int id;
    private int numeroMesa;
    private int cantidadPersonas;
    private double precioTotal;
    private List<PlatoComanda> listaPlatos;

    public BaseDataInput() {
    }

    public int getNumeroMesa() {
        return this.numeroMesa;
    }

    public int getCantidadPersonas() {
        return this.cantidadPersonas;
    }

    public double getPrecioTotal() {
        return this.precioTotal;
    }

    public List<PlatoComanda> getListaPlatos() {
        return this.listaPlatos;
    }

    public void setNumeroMesa(int numeroMesa) {
        this.numeroMesa = numeroMesa;
    }

    public void setCantidadPersonas(int cantidadPersonas) {
        this.cantidadPersonas = cantidadPersonas;
    }

    public void setPrecioTotal(double precioTotal) {
        this.precioTotal = precioTotal;
    }

    public void setListaPlatos(List<PlatoComanda> listaPlatos) {
        this.listaPlatos = listaPlatos;
    }

    public int getId() {
        return this.id;
    }

    public void setId(int id) {
        this.id = id;
    }

}
