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
import { Entrada, EntradaProps } from '../../Domain/Entities/entrada';
import { Entry } from '../../Domain/Entities/entrada.entity';
import { Degree } from '../../Domain/Entities/titulacion.entity';
import XLSX from 'xlsx';
import lineReader from 'line-reader';
import { DatosAula, DatosAulaProps } from '../../Domain/Entities/datosaula';

export interface servicioHorarioI {
    importarCursos(): Promise<Boolean>;
    importarAulas(): Promise<Boolean>;
    actualizarHorario(plan: string, curso: number, grupo: string, entradaProps: EntradaProps[]): Promise<string>;
    obtenerEntradas(plan: string, curso: number, grupo: string): Promise<Entrada[]>;
    obtenerHorasDisponibles(plan: string, curso: number, grupo: string): Promise<any[]>;
    obtenerTitulaciones(): Promise<any[]>;
}

@Injectable()
export class HorarioService implements servicioHorarioI {

    constructor(@Inject('HorarioRepository') private readonly horariorepository: HorarioRepository) { }

    async importarCursos(): Promise<Boolean> {

        const InsertarCursosPromise =
            new Promise<Boolean>((resolve, reject) => {
                // Transformamos el fichero .xlsx en .csv
                const excel = XLSX.readFile('./src/Mooc/Horario/Application/usecase/Listado207 2021-2022_sin TFE_sin_practicas_sin PC.xlsx');
                XLSX.writeFile(excel, './src/Mooc/Horario/Application/usecase/Listado207.csv', { bookType: "csv"});

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
                            numcursos: parseInt(fieldsArray[17]),
                            numperiodos: 2,
                            numgrupos: [parseInt(fieldsArray[23])]
                        };
                        titulaciones.push(await DatosTitulacion.createDatosTitulacion(titulacionprops));
                    }
                    i++
                }, async (err: any) => {
                    if (err) throw err;
                    try {
                        const titulacionesParseadas: DatosTitulacion[] = await parseTitulaciones(titulaciones);
                        //console.log(titulacionesParseadas);
                        const resultadoOperacion = await this.horariorepository.importarCursos(asignaturas, titulacionesParseadas);
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

    async importarAulas(): Promise<Boolean> {

        const InsertarAulasPromise =
            new Promise<Boolean>((resolve, reject) => {
                // Transformamos el fichero .xlsx en .csv
                const excel = XLSX.readFile('./src/Mooc/Horario/Application/usecase/aulas.xlsx');
                XLSX.writeFile(excel, './src/Mooc/Horario/Application/usecase/aulas.csv', { bookType: "csv"});
                // Leemos el fichero línea por línea
                var i = 0
                var aulas: DatosAula[] = [];
                lineReader.eachLine('./src/Mooc/Horario/Application/usecase/aulas.csv', async function (line: string) {
                    if (i > 0) {
                        var fieldsArray = line.split(';')
                        var aulaprops: DatosAulaProps = {
                            id: parseInt(fieldsArray[0]),
                            acronimo: fieldsArray[1],
                            nombre: fieldsArray[2].replace(/"/g, ''),
                            capacidad: isNaN(parseInt(fieldsArray[3])) ? null : parseInt(fieldsArray[3]),
                            edificio: parseInt(fieldsArray[4])
                        };
                        aulas.push(await DatosAula.createDatosAula(aulaprops));
                    }
                    i++
                }, async (err: any) => {
                    if (err) throw err;
                    try {
                        const resultadoOperacion = await this.horariorepository.importarAulas(aulas);
                        resolve(resultadoOperacion)
                    } catch (error) {
                        reject(error)
                    }
                });
            });

        return InsertarAulasPromise;
    }

    async actualizarHorario(plan: string, curso: number, grupo: string, entradasProps: EntradaProps[]): Promise<string> {
        const entradas: Entrada[] = entradasProps.map(function (entradaProps) {
            const entrada: Entrada = new Entrada("0", entradaProps);
            return entrada;
        });

        const horarioActualizado: string = await this.horariorepository.actualizarHorario(plan, curso, grupo, entradas);

        return horarioActualizado;
    }

    async obtenerEntradas(plan: string, curso: number, grupo: string): Promise<Entrada[]> {
        const entriesObtenidas: Entry[] = await this.horariorepository.obtenerEntradas(plan, curso, grupo);

        const entradasObtenidas: Entrada[] = entriesObtenidas.map(function (entryObtenida) {
            var entradaProps: EntradaProps = {
                Degree: entryObtenida.plan,
                Year: entryObtenida.curso,
                Group: entryObtenida.grupo,
                Init: entryObtenida.inicio,
                End: entryObtenida.fin,
                Subject: entryObtenida.nombreasignatura,
                Kind: entryObtenida.tipo,
                Room: entryObtenida.nombreaula,
                Week: entryObtenida.semana,
                Weekday: entryObtenida.dia
            };
            return new Entrada(entryObtenida.id.toString(), entradaProps)
        });

        return entradasObtenidas;
    }

    async obtenerHorasDisponibles(plan: string, curso: number, grupo: string): Promise<any[]> {
        return await this.horariorepository.obtenerHorasDisponibles(plan, curso, grupo);
    }

    async obtenerTitulaciones(): Promise<any[]> {
        const listaTitulaciones: Degree[] = await this.horariorepository.obtenerTitulaciones();
        const resultado: any[] = [];
        listaTitulaciones.map(function (titulacion: Degree) {
            const years: any[] = [];
            const numGruposCurso: string[] = titulacion.numgrupos.split(",");
            for (var curso = 1; curso <= titulacion.numcursos; curso++) {
                const groups: string[] = [];
                for (var grupo = 1; grupo <= parseInt(numGruposCurso[curso - 1]); grupo++) {
                    groups.push(grupo.toString());
                }
                years.push({ name: curso, groups: groups });
            }
            resultado.push({ name: titulacion.nombre, years: years });
        });
        console.log(resultado)

        return resultado;
    }
}

async function parseTitulaciones(titulaciones: DatosTitulacion[]): Promise<DatosTitulacion[]> {
    const titulacionesParseadas: DatosTitulacion[] = [];
    var nomTitulacion: string = "";
    for (var i = 0; i < titulaciones.length; i++) {
        if (titulaciones[i].getProps().nombre != nomTitulacion) {
            nomTitulacion = titulaciones[i].getProps().nombre;
            const titulacionesMismoNombre: DatosTitulacion[] = titulaciones.filter(titulacion => titulacion.getProps().nombre === nomTitulacion);
            const numCursos: number = Math.max(...titulacionesMismoNombre.map(titulacionMismoNombre => titulacionMismoNombre.getProps().numcursos));
            const numGrupos: number[] = [];
            for (var j = 1; j <= numCursos; j++) {
                const titulacionesMismoCurso: DatosTitulacion[] = titulacionesMismoNombre.filter(titulacionMismoNombre => titulacionMismoNombre.getProps().numcursos === j);
                const numGruposCurso = Math.max(...titulacionesMismoCurso.map(titulacionMismoCurso => titulacionMismoCurso.getProps().numgrupos[0]));
                numGrupos.push(numGruposCurso);
            }
            var titulacionprops: DatosTitulacionProps = {
                codplan: titulaciones[i].getProps().codplan,
                nombre: titulaciones[i].getProps().nombre,
                numcursos: numCursos,
                numperiodos: 2,
                numgrupos: numGrupos
            };
            titulacionesParseadas.push(await DatosTitulacion.createDatosTitulacion(titulacionprops));
        }
    }

    return titulacionesParseadas;
}