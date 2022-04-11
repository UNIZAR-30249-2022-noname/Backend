import { Incidencia } from './Entities/incidencia';
import { Issue }  from './Entities/incidencia.entity';

export interface IncidenciaRepository {
    guardar(incidencia: Incidencia): Promise<number>;
    actualizarEstado(id: number, state: number): Promise<number>;
    eliminar(id: number): Promise<number>;
    obtenerTodas(): Promise<Issue[]>;
}