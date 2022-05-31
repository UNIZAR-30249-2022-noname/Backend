import { Espacio, EspacioProps } from '../../Domain/Entities/espacio';
import { EspacioRepository } from '../../Domain/EspacioRepository';
import { Reserva } from '../../../Reserva/Domain/Entities/reserva'
import { Injectable, Inject } from '@nestjs/common';
import { Space } from '../../../../Infraestructure/Persistence/espacio.entity';
import csv from 'csv-parser';
import fs from 'fs';
import { InsertResult } from 'typeorm';

export interface servicioEspacioI {
  guardarEspacio(espacioProps: EspacioProps): Promise<Space>;
  buscarEspacioPorId(idEspacio: string): Promise<Space>;
  importarEspacios(csvContent: string): Promise<Boolean>;
  importarEspaciosAuto(): Promise<Boolean>;
  filtrarEspacios(espacioprops: EspacioProps, fecha?: string, hora?: number): Promise<Space[]>;
}

@Injectable()
export class EspacioService implements servicioEspacioI {
  
  constructor(
    @Inject('EspacioRepository')
    private readonly espaciorepository: EspacioRepository,
  ) {}

  async filtrarEspacios(
    espacioprops: EspacioProps,
    fecha?: string,
    hora?: number,
  ): Promise<Space[]> {
    //Seleccionamos la query a ejecutar en función de los parámetros.
    let query = -1;
    if (fecha == null && hora == null) {
      query = 0;
    } else if (fecha != null && hora == null) {
      query = 1;
    } else if (fecha == null && hora != null) {
      query = 2;
    } else {
      query = 3;
    }
    const listaEspacios: Space[] =
      await this.espaciorepository.filtrarEspaciosReservables(
        espacioprops,
        query,
        fecha,
        hora,
      );
    return listaEspacios;
  }

  async guardarEspacio(espacioProps: EspacioProps): Promise<Space> {
    const EspacioAGuardar: Espacio = new Espacio('CRE.1', espacioProps);
    const espacioGuardado: Space = await this.espaciorepository.guardar(
      EspacioAGuardar,
    );
    return espacioGuardado;
  }

  async buscarEspacioPorId(idEspacio: string): Promise<Space> {
    return await this.espaciorepository.buscarEspacioPorId(idEspacio);
  }

  async importarEspacios(csvContent: string): Promise<Boolean> {
    //console.log(csvContent.split("\n")[0]);
    var results: any[] = [];
    //Creamos un csv a partir del string obtenido de rabbit
    try {
      fs.writeFileSync('./src/Mooc/Espacio/Application/usecase/TB_ESPACIOS.csv', csvContent);
    } catch (err: any) {
      console.log('Error writing spaces csv' + err.message)
    }
    //Creamos una promise que se encarga de insertar todos los campos del fichero CSV en la base de Datos
    const InsertarEspaciosPromise =
      new Promise<InsertResult>(async (resolve, reject) => {
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
        /*results = csvContent.split("\n").filter(csvLinea => csvLinea.split(",").length >= 44);
          const espacios: Espacio[] = results.map(function (result) {
            const linea: string = result.split(",");
            const espacio = {
              ID_ESPACIO: linea[0],
              ID_CENTRO: linea[3],
              NMRO_PLAZAS: parseInt(linea[44]),
              TIPO_DE_USO: linea[6]
            };
            //console.log(espacio);
            return Espacio.crearEspacioPersonalizado(espacio);
          });
          try {
            const resultadoOperacion = await this.espaciorepository.importarEspacios(espacios);
            resolve(resultadoOperacion)
          } catch (error) {
            reject(error)
          }*/
      });

    try {
      return (await InsertarEspaciosPromise).identifiers.length > 0;
    } catch (error: any) {
      switch (error.code) {
        case '23505':
          console.log("Los espacios ya se encuentran almacenados en la base de datos.")
          break;
        default:
          console.error("Error al insertar espacios en la Base de datos, mensaje de error: ", error.message);
          break;
      }
      return false
    }

  }

  async importarEspaciosAuto(): Promise<Boolean> {
    const results: any[] = [];
    // TODO: Hacer esto transacional.
    //Creamos una promise que se encarga de insertar todos los campos del fichero CSV en la base de Datos
    const InsertarEspaciosPromise =
      new Promise<InsertResult>((resolve, reject) => {
        fs.createReadStream('./src/Mooc/Espacio/Application/usecase/TB_ESPACIOS_NO_BORRAR.csv')
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
      switch (error.code) {
        case '23505':
          console.log(
            'Los espacios ya se encuentran almacenados en la base de datos.',
          );
          break;
        default:
          console.error("Error al insertar espacios en la Base de datos, mensaje de error: ", error.message);
          break;
      }
      return false;
    }
  }
}
