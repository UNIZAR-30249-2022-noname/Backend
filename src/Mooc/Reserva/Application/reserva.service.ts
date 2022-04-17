import {
  DatosReservaProps,
  DatosReserva,
} from '../Domain/Entities/datosreserva';
import { Reserva} from '../Domain/Entities/reserva';
import { Espacio } from '../../Espacio/Domain/Entities/espacio';
import { ReservaRepository } from '../Domain/ReservaRepository';
import { ShortDomainId } from 'types-ddd';
import * as crypto from 'crypto';
import { Injectable, Inject } from '@nestjs/common';
import {Reserve} from '../Domain/Entities/reserva.entity';
import { ReservaRepoPGImpl } from '../Infraestructure/reserva.repository';

export interface servicioReservaI {
  guardarReserva(
    datosreserva: DatosReservaProps,
    idEspacio: string,
  ): Promise<Reserve>;
  eliminarReserva(idReserva: string): Promise<Boolean>;
}

@Injectable()
export class ReservaService implements servicioReservaI {
  constructor(@Inject('ReservaRepository')
  private readonly reservarepository: ReservaRepository) {}

  async guardarReserva(datosreserva: DatosReservaProps, idEspacio: string): Promise<Reserve> {
    try{
      //Creamos los datos de la reserva correspondiente que nos realizan.
      let Datos_Reserva: DatosReserva = await
          DatosReserva.createDatosReserva(datosreserva);
      //Instanciamos la reserva si se cumplen los invariantes de una reserva
      const ReservaARealizar: Reserva = new Reserva(null,Datos_Reserva,idEspacio)
      //Llamamos al repositorio
      const reservahecha: Reserve = await this.reservarepository.guardar(ReservaARealizar);
      return reservahecha
    }catch( error: any ){
      console.info(error.message);
      return null;
    }
  }

  async eliminarReserva(idReserva: string): Promise<Boolean> {
    const resultado = this.reservarepository.eliminar(parseInt(idReserva))
    return resultado
  }


}
