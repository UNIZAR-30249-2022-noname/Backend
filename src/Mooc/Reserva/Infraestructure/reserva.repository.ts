import { Reserva } from '../Domain/Entities/reserva';
import { ReservaRepository } from '../Domain/ReservaRepository';
import { Injectable } from '@nestjs/common';
import {Reserve}  from '../Domain/Entities/reserva.entity';
import { DatosReserva, DatosReservaProps } from '../Domain/Entities/datosreserva';
import dataSource from '../../../Config/ormconfig_db';
import { DataSource, DeleteResult, UpdateResult } from 'typeorm';
import {initializeDBConnector, returnRepository} from '../../../Infraestructure/Adapters/pg-connection'
import { Espacio, EspacioProps } from '../../Espacio/Domain/Entities/espacio';


enum ReservaQueries {
    QUERY_BUSCAR_RESERVA_POR_ID = 'SELECT * FROM reservas WHERE id=$1',
    QUERY_BUSCAR_RESERVAS_POR_ESPACIO = 'SELECT * FROM reservas WHERE space=$1',
    QUERY_BUSCAR_RESERVAS_POR_PERSONA = 'SELECT * FROM reservas WHERE person=$1',
    QUERY_BUSCAR_TODAS_RESERVAS = 'SELECT * FROM reservas',
    QUERY_INTRODUCIR_RESERVA = 'INSERT INTO reservas (space,hourstart,hourend,date,person) VALUES ($1,$2,$3,$4,$5)',
    QUERY_ACTUALIZAR_RESERVA = 'UPDATE reservas SET hourstart=$1,hourend=$2,date=$3 WHERE id=$4',
    QUERY_ELIMINAR_RESERVA = 'DELETE FROM reservas WHERE id=$1',
  }
  

export class ReservaRepoPGImpl implements ReservaRepository {
  //Guarda una objeto reserva, devuelve verdad si ha podido insertar la reserva en la base de datos.
  async guardar(reserva: Reserva): Promise<Reserve> {
    //Inicializar el repositorio para le entidad Reserve
    const DataSrc: DataSource = await initializeDBConnector(dataSource);
    const ReserveRepo = DataSrc.getRepository(Reserve)
    const reserveDTO: Reserve = new Reserve();
    //Agregamos los atributos a nuestro DTO procedentes de la reserva
    reserveDTO.fillReserveWithDomainEntity(reserva);
    await ReserveRepo.save(reserveDTO);
    const reservaHecha: Reserve = await ReserveRepo.findOne({
      where: {
        id: reserveDTO.id,
      },
    });
    return reservaHecha
  }
  async actualizar(
    id: number,
    hourstart: string,
    hourend: string,
    date: string,
  ): Promise<boolean> {
    const DataSrc: DataSource = await initializeDBConnector(dataSource);
    const ReserveRepo = DataSrc.getRepository(Reserve);
    const ReservaActualizada: UpdateResult = await ReserveRepo.update(id, { fecha:date, horainicio:hourstart, horafin:hourend });
    console.log(ReservaActualizada)
    
    return true;
  }
  async eliminar(id: number): Promise<boolean> {
    //Elimina una reserva dada la su identificador
    const ReserveRepo = await returnRepository(Reserve);
    const ReservaEliminada: DeleteResult = await ReserveRepo.delete(id);
    console.log(ReservaEliminada);
    //Devuelve verdad si y solo si se ha eliminado al menos una reserva de la base de datos
    return ReservaEliminada.affected > 0 ? true : false;
  }
  
  async buscarReservaPorId(id: number): Promise<Reserve> {
    const DataSrc: DataSource = await initializeDBConnector(dataSource);
    const ReserveRepo = DataSrc.getRepository(Reserve);
    const ReservaObtenida: Reserve = await ReserveRepo.findOne({
      where: {
        id: id,
      },
    });

    return ReservaObtenida;
  }
  
  async buscarReservasPorEspacioyFecha(idEspacio: string, fecha: string): Promise<Reserve[]> {
      const ReserveRepo = await returnRepository(Reserve);
      const ReservasObtenidas: Reserve[] = await ReserveRepo.find({
        where: {
          espacioid: idEspacio,
          fecha: fecha,
        },
      });
    return ReservasObtenidas;
  }

}