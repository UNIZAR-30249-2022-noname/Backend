import { Espacio } from './Entities/espacio';

export interface EspacioRepository {
  guardar(espacio: Espacio): Promise<boolean>;
  buscarEspacioPorId(id: String): Promise<Espacio[]>;
  //filtrarEspaciosReservables(capacity: number, day: string, hour: string, floor: string, building: string, kind: string): Promise<Espacio[]>;
}
