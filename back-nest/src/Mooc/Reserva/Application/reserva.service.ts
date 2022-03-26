import {DatosReservaProps, DatosReserva} from '../Domain/Entities/datosreserva'
import {Reserva, ReservaProps} from '../Domain/Entities/reserva'
import {Espacio, EspacioProps} from '../../Espacio/Domain/espacio'
import { ReservaRepository } from '../Domain/ReservaRepository';
import { ShortDomainId } from 'types-ddd';
import * as crypto from "crypto";
import { Injectable, Inject } from '@nestjs/common';


export interface servicioReservaI {
    guardarReserva(datosreserva: DatosReservaProps, espacio: EspacioProps): Promise<boolean>;
}

@Injectable()
export class ReservaService implements servicioReservaI {

    constructor(@Inject('ReservaRepository') private readonly Reservarepository: ReservaRepository){}
    
    async guardarReserva(datosreservaprops: DatosReservaProps, espacioprops: EspacioProps): Promise<boolean> {
        try {
            //<--Para construir un objeto Reserva igual estaría bien hacer un Factory porque hay mucho código por aqui-->
            //Creamos el objeto valor reserva y validamos la lógica de negocio para crear una reserva.
            console.log("Me llaman")
            const Datos_Reserva: DatosReserva = DatosReserva.createDatosReserva(datosreservaprops)
            //Creamos los datos de la reserva, si se ha validado la lógica de dominio.
            const espacio: Espacio = new Espacio(espacioprops)
            const reservaprops: ReservaProps = {
                Datosreserva: Datos_Reserva,
                Espacio: espacio,
                ID:  ShortDomainId.create(crypto.randomBytes(64).toString('hex')),
            }
            const reserva: Reserva = new Reserva(reservaprops)
            //return await this.Reservarepository.guardar(reserva)
            return true
        } catch (error) {
            return false
        }
               
    }


}