import {
  DatosReservaProps,
  DatosReserva,
} from '../Domain/Entities/datosreserva';
import { Reserva} from '../Domain/Entities/reserva';
import { Espacio, EspacioProps } from '../../Espacio/Domain/Entities/espacio';
import { ReservaRepository } from '../Domain/ReservaRepository';
import { ShortDomainId } from 'types-ddd';
import * as crypto from 'crypto';
import { Injectable, Inject } from '@nestjs/common';
import {Reserve} from '../Domain/Entities/reserva.entity';
import { ReservaRepoPGImpl } from '../Infraestructure/reserva.repository';

export interface servicioReservaI {
  guardarReserva(
    datosreserva: DatosReservaProps,
    espacio: EspacioProps,
  ): Promise<Reserve>;
  testFind(datosReserva: DatosReservaProps): Promise<Reserve[]>;
}

@Injectable()
export class ReservaService implements servicioReservaI {
  constructor(@Inject('ReservaRepository')
  private readonly reservarepository: ReservaRepository) {}

  async guardarReserva(datosreserva: DatosReservaProps, espacioprops: EspacioProps): Promise<Reserve> {
    //Creamos los datos de la reserva correspondiente que nos realizan.
    const Datos_Reserva: DatosReserva =
        DatosReserva.createDatosReserva(datosreserva);
    const id: ShortDomainId = ShortDomainId.create(crypto.randomBytes(64).toString('hex'))
    const ReservaARealizar: Reserva = new Reserva(id,Datos_Reserva,new Espacio(id,espacioprops))
    const reservahecha: Reserve = await this.reservarepository.guardar(ReservaARealizar);
    return reservahecha
  }

  async testFind(datosReserva: DatosReservaProps): Promise<Reserve[]>{
    console.log("Llaman a testFind")
    const lreservas: Reserve[] = await this.reservarepository.testFind(datosReserva);
    return lreservas
  }
}
