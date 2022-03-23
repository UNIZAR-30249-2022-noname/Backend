import {DatosReservaProps, DatosReserva} from '../../Domain/Entities/datosreserva'
import {Reserva, ReservaProps} from '../../Domain/Entities/reserva'
import {Espacio} from '../../../Espacio/Domain/espacio'
import { ReservaRepository } from '../../Domain/ReservaRepository';
import { ShortDomainId } from 'types-ddd';
import * as crypto from "crypto";


export interface servicioReserva {
    guardarReserva(datosreserva: DatosReservaProps, espacio: Espacio): Promise<boolean>;
}

export class servicioReservaImpl implements servicioReserva  {

    constructor(private readonly Reservarepository: ReservaRepository){}
    
    async guardarReserva(datosreservaprops: DatosReservaProps, espacio: Espacio): Promise<boolean> {
        try {
            //<--Para construir un objeto Reserva igual estaría bien hacer un Factory porque hay mucho código por aqui-->
            //Creamos el objeto valor reserva y validamos la lógica de negocio para crear una reserva.
            console.log("Me llaman")
            const Datos_Reserva: DatosReserva = DatosReserva.createDatosReserva(datosreservaprops)
            //Creamos los datos de la reserva, si se ha validado la lógica de dominio.
            const reservaprops: ReservaProps = {
                Datosreserva: Datos_Reserva,
                Espacio: espacio,
                ID:  ShortDomainId.create(crypto.randomBytes(64).toString('hex')),
            }
            const reserva: Reserva = new Reserva(reservaprops)
            //return await this.Reservarepository.guardar(reserva)
            return true
        } catch (error: any) {
            return false
        }
               
    }


}