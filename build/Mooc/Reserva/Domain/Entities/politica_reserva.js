"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoliticaReserva = void 0;
class PoliticaReserva {
    static seCumple(props) {
        // Llamar al repositorio y obtener los datos correspondientes a la reserva a partir de props.
        // Comprobar si existe una solapación contra otro horario entre horaIni y horaFin en esa fecha.
        // Si no existe una solapación devolver verdadero.
        // Si existe devolver falso.
        return true;
    }
}
exports.PoliticaReserva = PoliticaReserva;
