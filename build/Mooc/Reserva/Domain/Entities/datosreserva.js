"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatosReserva = void 0;
const types_ddd_1 = require("types-ddd");
const politica_reserva_1 = require("./politica_reserva");
class DatosReserva extends types_ddd_1.ValueObject {
    constructor(propsReserva) {
        super(propsReserva);
    }
    /**
     * Forzamos una validación contra la lógica de dominio utilizando un constructor
     * privado. Se debe llamar a este método que comprobara la lógica de dominio.
     *
     * @param props datos de una reserva
     * @returns Crea una reserva si se cumple con la "PoliticaReserva", sino lanza un error.
     */
    static createDatosReserva(props) {
        if (politica_reserva_1.PoliticaReserva.seCumple(props)) { //Si se cumple la política se crea el objeto datosRserva
            return new DatosReserva(props);
        }
        else {
            throw new Error("Error al crear la reserva.");
        }
    }
    getProps() {
        return this.props;
    }
}
exports.DatosReserva = DatosReserva;
