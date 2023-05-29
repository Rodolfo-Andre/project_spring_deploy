package com.proyecto.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.proyecto.dao.EmpleadoRepository;
import com.proyecto.entity.Empleado;

@Service
public class EmpleadoService {

    @Autowired
    EmpleadoRepository empleadoRepository;

    public void registrar(Empleado e) {
        empleadoRepository.save(e);
    }

    public void actualizar(Empleado e) {
        empleadoRepository.save(e);
    }

    public void eliminar(Integer id) {
        empleadoRepository.deleteById(id);
    }

    public List<Empleado> listarEmpleado() {
        return empleadoRepository.findAll();
    }

    public Empleado obtenerxId(Integer id) {
        return empleadoRepository.findById(id).orElse(null);

    }

    public Empleado findEmpleadoByIdUsario(Integer id) {
        return empleadoRepository.findEmpleadoByUsuario(id);
    }

}
