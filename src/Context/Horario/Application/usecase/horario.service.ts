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
import { Entry } from '../../../../Infraestructure/Persistence/entrada.entity';
import { Degree } from '../../../../Infraestructure/Persistence/titulacion.entity';
import XLSX from 'xlsx';
import lineReader from 'line-reader';

export interface servicioHorarioI {
    importarCursos(csvContent: string): Promise<Boolean>;
    importarCursosAuto(): Promise<Boolean>;
    actualizarHorario(plan: string, curso: number, grupo: string, entradaProps: EntradaProps[]): Promise<string>;
    obtenerEntradas(plan: string, curso: number, grupo: string): Promise<any[]>;
    obtenerHorasDisponibles(plan: string, curso: number, grupo: string): Promise<any[]>;
    obtenerTitulaciones(): Promise<any[]>;
}

@Injectable()
export class HorarioService implements servicioHorarioI {

    constructor(@Inject('HorarioRepository') private readonly horariorepository: HorarioRepository) { }

    async importarCursos(csvContent: string): Promise<Boolean> {
        
        const InsertarCursosPromise =
            new Promise<Boolean>((resolve, reject) => {
                //Creamos un csv a partir del string obtenido de rabbit
                try {
                    fs.writeFileSync('./src/Context/Horario/Application/usecase/Listado207.csv', csvContent);
                  } catch (err: any) {
                    console.log('Error writing courses csv' + err.message)
                  }

                // Leemos el fichero línea por línea
                var i = 0
                var asignaturas: DatosAsignatura[] = [];
                var titulaciones: DatosTitulacion[] = [];
                lineReader.eachLine('./src/Context/Horario/Application/usecase/Listado207.csv', async function (line: string) {
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
                            horasestteoria: Math.ceil(parseFloat(fieldsArray[30]) / 15),
                            horasestproblemas: Math.ceil(parseFloat(fieldsArray[32]) / 15),
                            horasestpracticas: Math.ceil(parseFloat(fieldsArray[34]) / 15)
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

        return InsertarCursosPromise;
    }

    async importarCursosAuto(): Promise<Boolean> {

        const InsertarCursosPromise =
            new Promise<Boolean>((resolve, reject) => {
                // Transformamos el fichero .xlsx en .csv
                const excel = XLSX.readFile('./src/Context/Horario/Application/usecase/Listado207 2021-2022_sin TFE_sin_practicas_sin PC.xlsx');
                const csvContent = XLSX.utils.sheet_to_csv(excel.Sheets[excel.SheetNames[0]], {FS: ";"})

                try {
                    fs.writeFileSync('./src/Context/Horario/Application/usecase/Listado207.csv', csvContent);
                  } catch (err: any) {
                    console.log('Error writing courses csv' + err.message)
                  }
                //XLSX.writeFile(excel, './src/Context/Horario/Application/usecase/Listado207.csv', { bookType: "csv"});

                // Leemos el fichero línea por línea
                var i = 0
                var asignaturas: DatosAsignatura[] = [];
                var titulaciones: DatosTitulacion[] = [];
                lineReader.eachLine('./src/Context/Horario/Application/usecase/Listado207.csv', async function (line: string) {
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
                            horasestteoria: Math.ceil(parseFloat(fieldsArray[30]) / 15),
                            horasestproblemas: Math.ceil(parseFloat(fieldsArray[32]) / 15),
                            horasestpracticas: Math.ceil(parseFloat(fieldsArray[34]) / 15)
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

        return InsertarCursosPromise;
    }

    async actualizarHorario(plan: string, curso: number, grupo: string, entradasProps: EntradaProps[]): Promise<string> {
        const entradas: Entrada[] = entradasProps.map(function (entradaProps) {
            const entrada: Entrada = new Entrada("0", entradaProps);
            return entrada;
        });

        const horarioActualizado: string = await this.horariorepository.actualizarHorario(plan, curso, grupo, entradas);

        return horarioActualizado;
    }

    async obtenerEntradas(plan: string, curso: number, grupo: string): Promise<any[]> {
        const entriesObtenidas: Entry[] = await this.horariorepository.obtenerEntradas(plan, curso, grupo);

        const entradasObtenidas: any[] = entriesObtenidas.map(function (entryObtenida) {
            const entradaProps = {
                id: entryObtenida.id,
                Degree: entryObtenida.plan,
                Year: entryObtenida.curso,
                Group: entryObtenida.grupo,
                Init: { hour: parseInt(entryObtenida.inicio.split(':')[0]), min: parseInt(entryObtenida.inicio.split(':')[1]) },
                End: { hour: parseInt(entryObtenida.fin.split(':')[0]), min: parseInt(entryObtenida.fin.split(':')[1]) },
                Subject: { Name: entryObtenida.nombreasignatura, Kind: entryObtenida.tipo },
                Room: { Name: entryObtenida.idaula },
                Week: entryObtenida.semana,
                Weekday: entryObtenida.dia
            };
            return entradaProps;
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