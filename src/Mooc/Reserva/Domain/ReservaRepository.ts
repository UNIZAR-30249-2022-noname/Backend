import { Reserva } from './Entities/reserva';

export interface ReservaRepository {
  guardar(reserva: Reserva): Promise<boolean>;
  actualizar(
    id: string,
    hourstart: string,
    hourend: string,
    date: string,
  ): Promise<boolean>;
  eliminar(id: string): Promise<boolean>;
  buscarReservaPorId(id: string): Promise<Reserva[]>;
  buscarReservasPorEspacio(idEspacio: string): Promise<Reserva[]>;
}
