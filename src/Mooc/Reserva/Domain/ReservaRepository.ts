import { DatosReservaProps } from './Entities/datosreserva';
import { Reserva } from './Entities/reserva';
import  {Reserve}  from './Entities/reserva.entity';

export interface ReservaRepository {
  guardar(reserva: Reserva): Promise<Reserve>;
  actualizar(
    id: string,
    hourstart: string,
    hourend: string,
    date: string,
  ): Promise<boolean>;
  eliminar(id: string): Promise<boolean>;
  buscarReservaPorId(id: string): Promise<Reserva[]>;
  buscarReservasPorEspacio(idEspacio: string): Promise<Reserva[]>;
  testFind(datosReserva: DatosReservaProps): Promise<Reserve[]>;
}
