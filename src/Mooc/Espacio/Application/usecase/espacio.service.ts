import {
  Espacio,
  EspacioProps,
} from '../../Domain/Entities/espacio';
import { ShortDomainId } from 'types-ddd';
import * as crypto from 'crypto';
import { EspacioRepository } from '../../Domain/EspacioRepository';
import {Reserva} from '../../../Reserva/Domain/Entities/reserva'
import { Injectable, Inject } from '@nestjs/common';
import { Space } from '../../Domain/Entities/espacio.entity';
import csv from 'csv-parser';
import fs from 'fs';
import { InsertResult } from 'typeorm';
import { buildingValues, kindValues } from './importarEspaciosValues'

export interface servicioEspacioI {
  guardarEspacio(espacioProps: EspacioProps): Promise<Space>;
  buscarEspacioPorId(id: String): Promise<Espacio[]>;
  listarReservas(id:String, fecha:String): Promise<Reserva[]>;
  importarEspacios(): Promise<Boolean>;
  filtrarEspacios(espacioprops: EspacioProps, espacioId: string):Promise<Space[]>;
}

@Injectable()
export class EspacioService implements servicioEspacioI {
  
  constructor(@Inject('EspacioRepository') private readonly espaciorepository: EspacioRepository) {}

  async filtrarEspacios(espacioprops: EspacioProps, espacioId: string): Promise<Space[]> {
    let EntidadEspacio: Espacio = new Espacio(espacioId,espacioprops);
    const listaEspacios: Space[] = await this.espaciorepository.filtrarEspaciosReservables(EntidadEspacio)
    return listaEspacios;
  }
  
  listarReservas(id: String, fecha: String): Promise<Reserva[]> {
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
        //console.log(results[0]);
        const espacios: Espacio[] = results.map(function (result) {
          var edificio: string = "B"+ result.ID_ESPACIO.split('.')[1];
          var planta = "F" + result.ID_ESPACIO.split('.')[2];
          var espacioprops: EspacioProps = {
            Name: result.ID_CENTRO,
            Capacity: result.NMRO_PLAZAS,
            Building: Object.values(buildingValues)[Object.keys(buildingValues).indexOf(edificio)],
            Floor: Object.values(buildingValues)[Object.keys(buildingValues).indexOf(planta)],
            Kind: Object.values(kindValues)[Object.keys(kindValues).indexOf("K" + result.TIPO_DE_USO)],
          };
          return new Espacio(result.ID_ESPACIO, espacioprops)
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
      console.error("Error al insertar espacios en la Base de datos, mensaje de error: ",error.message);
      return false
    }

  }

}
