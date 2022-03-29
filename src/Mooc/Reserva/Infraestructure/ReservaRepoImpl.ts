import { Reserva } from '../Domain/Entities/reserva';
import { ReservaRepository } from '../Domain/ReservaRepository';
import { poolConn } from '../../../Infraestructure/Adapters/pg-connection';
import { ReservaQueries } from './ReservaQueries';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ReservaRepoPGImpl implements ReservaRepository {
  //Guarda una objeto reserva, devuelve verdad si ha podido insertar la reserva en la base de datos.
  async guardar(reserva: Reserva): Promise<boolean> {
    var client = await poolConn.connect();
    const datosReserva = reserva.getDatosReservaProps();
    const idEspacioReserva = reserva.getEspacio().getDatosEspacioProps().ID.uid;
    var resultadoQuery = await client.query(
      ReservaQueries.QUERY_INTRODUCIR_RESERVA,
      [
        idEspacioReserva,
        datosReserva.HoraInicio,
        datosReserva.HoraFin,
        datosReserva.Fecha,
        datosReserva.Persona,
      ],
    );
    //Analizar resultados devolver una cosa u otra
    client.release();
    return resultadoQuery.rowCount > 0;
  }
  async actualizar(
    id: string,
    hourstart: string,
    hourend: string,
    date: string,
  ): Promise<boolean> { 
    var client = await poolConn.connect();
    var resultadoQuery = await client.query(
      ReservaQueries.QUERY_ACTUALIZAR_RESERVA,
      [hourstart, hourend, date, id],
    );
    //Analizar resultados devolver una cosa u otra
    client.release();
    return true;
  }
  async eliminar(id: string): Promise<boolean> {
    var client = await poolConn.connect();
    var resultadoQuery = await client.query(
      ReservaQueries.QUERY_ELIMINAR_RESERVA,
      [id],
    );
    //Analizar resultados devolver una cosa u otra
    client.release();
    return true;
  }
  //Aquí en vez de devolver un booleano deberíamos devolver el objeto resorver rehidratado de la base de datos
  async buscarReservaPorId(id: string): Promise<Boolean> {
    var client = await poolConn.connect();
    var resultadoQuery = await client.query(
      ReservaQueries.QUERY_BUSCAR_RESERVA_POR_ID,
      [id],
    );
    //Analizar resultados devolver una cosa u otra
    client.release();
    console.log(resultadoQuery.rows);
    return true;
  }
}
