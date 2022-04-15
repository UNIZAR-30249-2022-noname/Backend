import { InsertResult } from 'typeorm';
import { Espacio} from './Entities/espacio';
import { Space } from './Entities/espacio.entity';

export interface EspacioRepository {
  guardar(espacio: Espacio): Promise<Space>;
  buscarEspacioPorId(id: string): Promise<Space>;
  filtrarEspaciosReservables(espacioprops: Espacio,fecha?: string, hora?: number): Promise<Space[]>;
  importarEspacios(espacios: Espacio[]): Promise<InsertResult>;
}
