package com.proyecto.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.proyecto.dao.ComprobanteRepository;
import com.proyecto.dao.DetalleComprobanteRepository;
import com.proyecto.entity.Comprobante;
import com.proyecto.entity.DetalleComprobante;

@Service
public class ComprobanteService {

    @Autowired
    private ComprobanteRepository repository;

    @Autowired
    private DetalleComprobanteRepository detalleComprobanteRepository;

    public void registrar(Comprobante d) {
        repository.save(d);
    }

    public void actualizar(Comprobante d) {
        repository.save(d);
    }

    public void eliminar(Integer id) {
        repository.deleteById(id);
    }

    public Comprobante findById(int id) {
        return repository.findById(id).orElse(null);
    }

    public List<Comprobante> getAll() {
        return repository.findAll();
    }

    public DetalleComprobante registrarDetalle(DetalleComprobante d) {
        return detalleComprobanteRepository.save(d);
    }

}
