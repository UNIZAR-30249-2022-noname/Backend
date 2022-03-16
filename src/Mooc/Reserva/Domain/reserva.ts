import {DatosReserva} from './datosreserva'

export class Reserva {

    private readonly id: string;
    public datosReserva: DatosReserva;
    //public readonly espacio: Espacio; falta crear esta entidad del Dominio

    constructor({id,datosReserva}: {id: string,datosReserva: DatosReserva}) {
        this.id = id;
        //this.espacio = espacio;
        this.datosReserva = datosReserva;
    }
}