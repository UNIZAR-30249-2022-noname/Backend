import { InsertResult } from 'typeorm';
import { DatosAsignatura } from './Entities/datosasignatura';
import { DatosTitulacion } from './Entities/datostitulacion';
import { Entrada } from './Entities/entrada';
import { Entry } from './Entities/entrada.entity';

export interface HorarioRepository {
  importarCursos(asignaturas: DatosAsignatura[], titulaciones: DatosTitulacion[]): Promise<Boolean>;
  importarTitulaciones(titulaciones: DatosTitulacion[]): Promise<Boolean>;
  actualizarHorario(plan: string, curso: number, grupo: string, entradas: Entrada[]): Promise<string>;
  obtenerEntradas(plan: string, curso: number, grupo: string): Promise<Entry[]>;
}