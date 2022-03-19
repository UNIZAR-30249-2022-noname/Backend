import { Reserva } from "./Entities/reserva";

export interface ReservaRepository {
    guardar(reserva: Reserva): Promise<boolean>;
}