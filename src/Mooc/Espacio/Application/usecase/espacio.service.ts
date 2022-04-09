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

export interface servicioEspacioI {
  guardarEspacio(espacioProps: EspacioProps): Promise<Space>;
  buscarEspacioPorId(id: String): Promise<Espacio[]>;
  listarReservas(id:String, fecha:String): Promise<Reserva[]>;
  importarEspacios(): Promise<Boolean>;
}

@Injectable()
export class EspacioService implements servicioEspacioI {
  constructor(@Inject('EspacioRepository')
  private readonly espaciorepository: EspacioRepository) {}
  
  listarReservas(id: String, fecha: String): Promise<Reserva[]> {
    throw new Error('Method not implemented.');
  }

  async guardarEspacio(espacioProps: EspacioProps): Promise<Space> {
    const EspacioAGuardar: Espacio = new Espacio(ShortDomainId.create("CRE.1"), espacioProps)
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
    fs.createReadStream('./src/Mooc/Espacio/Application/usecase/TB_ESPACIOS.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      //console.log(results[0]);
      const espacios: Espacio[] = results.map(function (result) {
        var espacioprops: EspacioProps = {
          Id: result.ID_ESPACIO,
          Name: result.ID_CENTRO,
          Capacity: result.NMRO_PLAZAS,
          Building: result.ID_EDIFICIO,
          Floor: result.ID_UTC,
          Kind: result.TIPO_DE_USO,
        };
        return new Espacio(ShortDomainId.create(result.ID_ESPACIO), espacioprops)
      });
      this.espaciorepository.importarEspacios(espacios);
    });

    return true;
  }

}
