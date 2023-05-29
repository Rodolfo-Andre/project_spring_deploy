package com.proyecto.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.proyecto.entity.Comanda;

public interface ComandaRepository extends JpaRepository<Comanda, Integer> {

    
    @Query("SELECT c FROM Comanda c  inner join Mesa m on c.mesa.id = m.id  inner join EstadoComanda ec on c.estadoComanda.id = ec.id where m.id = :mesaId and ec.estado = 'Sin pagar' and m.estado = 'Ocupado'")
    Comanda findByMesaId(@Param("mesaId") int mesaId);


    @Query("SELECT c FROM Comanda c  inner join DetalleComanda dc on c.id = dc.comanda.id where c.id = :id")
    Comanda getComandaWithDetalilsComandaById(int id);

}
