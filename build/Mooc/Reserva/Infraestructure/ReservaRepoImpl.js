"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservaRepoPGImpl = void 0;
const pg_connection_1 = require("../../../Infraestructure/Adapters/pg-connection");
const ReservaQueries_1 = require("./ReservaQueries");
class ReservaRepoPGImpl {
    async guardar(reserva) {
        var client = await pg_connection_1.poolConn.connect();
        const datosReserva = reserva.getDatosReservaProps();
        var resultadoQuery = await client.query(ReservaQueries_1.ReservaQueries.QUERY_INTRODUCIR_RESERVA, [datosReserva.fecha, datosReserva.horaFin]);
        //Analizar resultados devolver una cosa u otra
        client.release();
        return resultadoQuery.rowCount > 0;
    }
}
exports.ReservaRepoPGImpl = ReservaRepoPGImpl;
