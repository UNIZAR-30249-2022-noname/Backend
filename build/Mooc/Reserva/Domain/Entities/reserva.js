"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reserva = void 0;
const types_ddd_1 = require("types-ddd");
class Reserva extends types_ddd_1.Entity {
    constructor(props) {
        super(props, Reserva.name);
    }
    getDatosReservaProps() {
        const propsReserva = this.props.Datosreserva.getProps();
        return propsReserva;
    }
}
exports.Reserva = Reserva;
