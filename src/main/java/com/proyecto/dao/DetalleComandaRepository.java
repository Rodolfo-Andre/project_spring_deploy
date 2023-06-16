package com.proyecto.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.proyecto.entity.DetalleComanda;

public interface DetalleComandaRepository extends JpaRepository<DetalleComanda, Integer> {
  @Query("SELECT dc FROM DetalleComanda dc inner join Comanda c on dc.comanda.id = c.id inner join Plato p on dc.plato.id = p.id where dc.comanda.id = :comandaId and  dc.plato.id = :platoId")
  public DetalleComanda findByPlatoComandaId(@Param("comandaId") int comandaId, @Param("platoId") String platoId);

  @Query("SELECT dc FROM DetalleComanda dc inner join Comanda c on dc.comanda.id = c.id where dc.comanda.id = :comandaId")
  public List<DetalleComanda> findByComandaId(int comandaId);

  @Query("SELECT dc FROM DetalleComanda dc inner join Comanda c on dc.comanda.id = c.id inner join Plato p on dc.plato.id = p.id where dc.comanda.id = :comandaId and  dc.plato.id = :platoId")
  public DetalleComanda findDetalleComandaByPlatoIdAndComandaId(String platoId, int comandaId);

  @Query(value = "SELECT  * FROM reporte_platomas_vendido()", nativeQuery = true)
  List<Object[]> generarReporteplato();
}
