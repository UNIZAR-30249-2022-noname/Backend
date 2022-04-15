import {
  Espacio,
  EspacioProps,
} from '../../Domain/Entities/espacio';
import * as crypto from 'crypto';
import { EspacioRepository } from '../../Domain/EspacioRepository';
import {Reserva} from '../../../Reserva/Domain/Entities/reserva'
import { Injectable, Inject } from '@nestjs/common';
import { Space } from '../../Domain/Entities/espacio.entity';
import csv from 'csv-parser';
import fs from 'fs';
import { InsertResult } from 'typeorm';

export interface servicioEspacioI {
  guardarEspacio(espacioProps: EspacioProps): Promise<Space>;
  buscarEspacioPorId(id: String): Promise<Espacio[]>;
  listarReservas(idEspacio:String, fecha:String): Promise<Reserva[]>;
  importarEspacios(): Promise<Boolean>;
  filtrarEspacios(espacioprops: EspacioProps,fecha?: string, hora?: number):Promise<Space[]>;
}

@Injectable()
export class EspacioService implements servicioEspacioI {
  
  constructor(@Inject('EspacioRepository') private readonly espaciorepository: EspacioRepository) {}

  async filtrarEspacios(espacioprops: EspacioProps,fecha?: string, hora?: number): Promise<Space[]> {
    let EntidadEspacio: Espacio = new Espacio(null,espacioprops);
    const query = ''
    if(fecha != null){
      
    }
    const listaEspacios: Space[] = await this.espaciorepository.filtrarEspaciosReservables(EntidadEspacio)
    return listaEspacios;
  }
  
  listarReservas(idEspacio: String, fecha: String): Promise<Reserva[]> {
    throw new Error('Method not implemented.');
  }

  async guardarEspacio(espacioProps: EspacioProps): Promise<Space> {
    const EspacioAGuardar: Espacio = new Espacio("CRE.1", espacioProps)
    const espacioGuardado: Space = await this.espaciorepository.guardar(EspacioAGuardar);
    return espacioGuardado;
  }

  async buscarEspacioPorId(id: String): Promise<Espacio[]> {
    /*try {
      console.log('Llamada a buscarEspacioPorId');
      return await this.Espaciorepository.buscarEspacioPorId(id);
    } catch (error: any) {
      console.log(error);
      return error;
    }
  */
  throw new Error('not implemented')
  }

  async importarEspacios(): Promise<Boolean> {

    const results: any[] = [];
    // TODO: Hacer esto transacional.
    //Creamos una promise que se encarga de insertar todos los campos del fichero CSV en la base de Datos
    const InsertarEspaciosPromise = 
    new Promise<InsertResult>((resolve, reject) => {
      fs.createReadStream('./src/Mooc/Espacio/Application/usecase/TB_ESPACIOS.csv')
      .on('error', err => {
        reject(err)
      })
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        const espacios: Espacio[] = results.map(function (espacio) {
          return Espacio.crearEspacioPersonalizado(espacio);
        });
        try {
          const resultadoOperacion = await this.espaciorepository.importarEspacios(espacios);
          resolve(resultadoOperacion)
        } catch (error) {
          reject(error)
        }
      });
    });
    
    try {
       return (await InsertarEspaciosPromise).identifiers.length > 0;
    } catch (error: any) {
      switch(error.code){
        case '23505':
          console.log("Los espacios ya se encuentran almacenados en la base de datos.")
          break;
        default:
          console.error("Error al insertar espacios en la Base de datos, mensaje de error: ",error.message);
          break;
      }
      return false
    }

  }

}
