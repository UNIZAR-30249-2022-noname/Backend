import { Incidencia } from './Entities/incidencia';
import { Issue } from '../../../Infraestructure/Persistence/incidencia.entity';

export interface IncidenciaRepository {
  guardar(incidencia: Incidencia): Promise<number>;
  actualizarEstado(id: number, state: number): Promise<number>;
  eliminar(id: number): Promise<number>;
  obtenerTodas(): Promise<Issue[]>;
  obtenerIncidenciasPorEdificio(edificio: string): Promise<Issue[]>;
}
