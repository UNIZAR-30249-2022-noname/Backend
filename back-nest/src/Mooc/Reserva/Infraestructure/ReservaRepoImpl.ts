import { Reserva } from "../Domain/Entities/reserva";
import { ReservaRepository } from "../Domain/ReservaRepository";
import {poolConn} from '../../../Infraestructure/Adapters/pg-connection'
import {ReservaQueries} from './ReservaQueries'
import { Injectable } from "@nestjs/common";

@Injectable()
export class ReservaRepoPGImpl implements ReservaRepository { 
    async guardar(reserva: Reserva): Promise<boolean> {
        var client = await poolConn.connect();
        const datosReserva = reserva.getDatosReservaProps();
        var resultadoQuery = await client.query(ReservaQueries.QUERY_INTRODUCIR_RESERVA, [datosReserva.fecha,datosReserva.horaFin])
        //Analizar resultados devolver una cosa u otra
        client.release()
        return resultadoQuery.rowCount > 0;
    }
}