import {
  Espacio,
  EspacioProps,
} from '../../../Espacio/Domain/Entities/espacio';
import { ShortDomainId } from 'types-ddd';
import * as crypto from 'crypto';
import { EspacioRepository } from '../../Domain/EspacioRepository';
import {Reserva} from '../../../Reserva/Domain/Entities/reserva'

export interface servicioEspacio {
  guardarEspacio(espacioProps: EspacioProps): Promise<boolean>;
  buscarEspacioPorId(id: String): Promise<Espacio>;
  listarReservas(id:String, fecha:String): Promise<Reserva[]>
}

export class servicioEspacioImpl implements servicioEspacio {
  constructor(private readonly Espaciorepository: EspacioRepository) {}
  
  listarReservas(id: String, fecha: String): Promise<Reserva[]> {
    throw new Error('Method not implemented.');
  }

  async guardarEspacio(espacioProps: EspacioProps): Promise<boolean> {
    try {
      //<--Para construir un objeto Reserva igual estaría bien hacer un Factory porque hay mucho código por aqui-->
      //Creamos el objeto valor reserva y validamos la lógica de negocio para crear una reserva.
      console.log('Llamada a guardarEspacio');
      const espacio: Espacio = new Espacio(espacioProps);
      return await this.Espaciorepository.guardar(espacio);
    } catch (error: any) {
      console.log(error);
      return false;
    }
  }

  async buscarEspacioPorId(id: String): Promise<Espacio> {
    try {
      console.log('Llamada a buscarEspacioPorId');
      return await this.Espaciorepository.buscarEspacioPorId(id);
    } catch (error: any) {
      console.log(error);
      return error;
    }
  }
}
