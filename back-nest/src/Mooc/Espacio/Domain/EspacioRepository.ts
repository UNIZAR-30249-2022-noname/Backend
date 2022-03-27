import { Espacio } from "./Entities/espacio";

export interface EspacioRepository {
    guardar(espacio: Espacio): Promise<boolean>;
    buscarEspacioPorId(id: String): Promise<Espacio>;
}