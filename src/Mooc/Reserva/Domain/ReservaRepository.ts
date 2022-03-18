import { Reserva } from "./reserva";

export interface ReservaRepository {
    guardar(reserva: Reserva): Promise<void>;
}