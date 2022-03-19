import { Reserva } from "../Domain/reserva";
import { ReservaRepository } from "../Domain/ReservaRepository";
import {poolConn} from '../../../Infraestructure/Adapters/pg-connection'
import {ReservaQueries} from './ReservaQueries'

export default class ReservaRepoImpl implements ReservaRepository { 
    async guardar(reserva: Reserva): Promise<void>{
        var client = await poolConn.connect();
        const datosReserva = reserva.getDatosReservaProps();
        var resultadoQuery = await client.query(ReservaQueries.QUERY_INTRODUCIR_RESERVA, [datosReserva.fecha,datosReserva.horaFin])
        //Analizar resultados devolver una cosa u otra
        return new Promise<void>( () => {console.log("pesao")})
    }
}