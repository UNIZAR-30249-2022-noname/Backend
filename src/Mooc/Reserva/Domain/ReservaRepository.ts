import { DatosReservaProps } from './Entities/datosreserva';
import { Reserva } from './Entities/reserva';
import  {Reserve}  from './Entities/reserva.entity';

export interface ReservaRepository {
  guardar(reserva: Reserva): Promise<Reserve>;
  actualizar(
    id: number,
    hourstart: string,
    hourend: string,
    date: string,
  ): Promise<boolean>;
  eliminar(id: number): Promise<boolean>;
  buscarReservaPorId(id: number): Promise<Reserve>;
  buscarReservasPorEspacio(idEspacio: string): Promise<Reserve[]>;
}
