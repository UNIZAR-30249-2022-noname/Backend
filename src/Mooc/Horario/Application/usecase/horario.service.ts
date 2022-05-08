import * as crypto from 'crypto';
import { Reserva } from '../../../Reserva/Domain/Entities/reserva'
import { Injectable, Inject } from '@nestjs/common';
import csv from 'csv-parser';
import fs from 'fs';
import { InsertResult } from 'typeorm';
import { HorarioRepository } from '../../Domain/HorarioRepository';
import path from 'path';
import { DatosAsignatura, DatosAsignaturaProps } from '../../Domain/Entities/datosasignatura';
import { DatosTitulacion, DatosTitulacionProps } from '../../Domain/Entities/datostitulacion';
const XLSX = require('xlsx');
const lineReader = require('line-reader');

export interface servicioHorarioI {
    importarCursos(): Promise<Boolean>;
}

@Injectable()
export class HorarioService implements servicioHorarioI {

    constructor(@Inject('HorarioRepository') private readonly horariorepository: HorarioRepository) { }

    async importarCursos(): Promise<Boolean> {

        const InsertarCursosPromise =
            new Promise<Boolean>((resolve, reject) => {
                // Transformamos el fichero .xlsx en .csv
                const excel = XLSX.readFile('./src/Mooc/Horario/Application/usecase/Listado207 2021-2022_sin TFE_sin_practicas_sin PC.xlsx');
                XLSX.writeFile(excel, './src/Mooc/Horario/Application/usecase/Listado207.csv', { bookType: "csv", FS: ';' });

                // Leemos el fichero línea por línea
                var i = 0
                var asignaturas: DatosAsignatura[] = [];
                var titulaciones: DatosTitulacion[] = [];
                lineReader.eachLine('./src/Mooc/Horario/Application/usecase/Listado207.csv', async function (line: string) {
                    if (i > 2) {
                        var fieldsArray = line.split(';')
                        var asignaturaprops: DatosAsignaturaProps = {
                            id: 0,
                            codasig: parseInt(fieldsArray[3]),
                            nombre: fieldsArray[4],
                            area: fieldsArray[7],
                            codplan: parseInt(fieldsArray[11]),
                            plan: fieldsArray[12],
                            curso: parseInt(fieldsArray[17]),
                            periodo: fieldsArray[18],
                            destvinculo: parseInt(fieldsArray[22]),
                            numgrupos: parseInt(fieldsArray[23]),
                            horasestteoria: parseFloat(fieldsArray[30]),
                            horasestproblemas: parseFloat(fieldsArray[32]),
                            horasestpracticas: parseFloat(fieldsArray[34])
                        };
                        asignaturas.push(await DatosAsignatura.createDatosAsignatura(asignaturaprops));

                        var titulacionprops: DatosTitulacionProps = {
                            codplan: parseInt(fieldsArray[11]),
                            nombre: fieldsArray[12],
                            numcursos: 4,
                            numperiodos: 2,
                            numgrupos: parseInt(fieldsArray[23])
                        };
                        titulaciones.push(await DatosTitulacion.createDatosTitulacion(titulacionprops));
                    }
                    i++
                }, async (err: any) => {
                    if (err) throw err;
                    try {
                        const resultadoOperacion = await this.horariorepository.importarCursos(asignaturas, titulaciones);
                        resolve(resultadoOperacion)
                    } catch (error) {
                        reject(error)
                    }
                });
            });

        /*try {
            console.log(InsertarHorariosPromise)
            return (await InsertarHorariosPromise).identifiers.length > 0;
        } catch (error: any) {
            switch (error.code) {
                case '23505':
                    console.log("Los cursos ya se encuentran almacenados en la base de datos.")
                    break;
                default:
                    console.error("Error al insertar cursos en la Base de datos, mensaje de error: ", error.message);
                    break;
            }
            return false
        }*/

        return InsertarCursosPromise;
    }
}