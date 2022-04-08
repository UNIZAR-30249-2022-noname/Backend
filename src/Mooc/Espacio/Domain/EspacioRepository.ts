import { Espacio } from './Entities/espacio';
import { Space } from './Entities/espacio.entity';

export interface EspacioRepository {
  guardar(espacio: Espacio): Promise<Space>;
  buscarEspacioPorId(id: string): Promise<Space>;
  filtrarEspaciosReservables(capacity: number, day: string, hour: string, floor: string, building: string, kind: string): Promise<any>;
}
