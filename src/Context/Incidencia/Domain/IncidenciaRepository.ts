import { Incidencia } from './Entities/incidencia';
import { Issue } from '../../../Infraestructure/Persistence/incidencia.entity';

export interface IncidenciaRepository {
  guardar(incidencia: Incidencia): Promise<number>;
  obtenerPorId(id: number): Promise<Issue>;
  actualizarEstado(incidencia: Incidencia): Promise<number>;
  eliminar(id: number): Promise<number>;
  obtenerTodas(): Promise<Issue[]>;
  obtenerIncidenciasPorEdificio(edificio: string): Promise<Issue[]>;
}
