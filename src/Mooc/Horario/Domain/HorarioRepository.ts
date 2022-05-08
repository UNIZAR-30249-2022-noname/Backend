import { InsertResult } from 'typeorm';
import { DatosAsignatura } from './Entities/datosasignatura';
import { DatosTitulacion } from './Entities/datostitulacion';

export interface HorarioRepository {
  importarCursos(asignaturas: DatosAsignatura[], titulaciones: DatosTitulacion[]): Promise<Boolean>;
  importarTitulaciones(titulaciones: DatosTitulacion[]): Promise<Boolean>;
}