import { Injectable } from "@nestjs/common";
import { Reserve } from "../src/Mooc/Reserva/Domain/Entities/reserva.entity";
import { ReservaRepository } from "../src/Mooc/Reserva/Domain/ReservaRepository";
import { Reserva } from "src/Mooc/Reserva/Domain/Entities/reserva";

@Injectable()
export class MockReservaRepository implements ReservaRepository {

  guardar(reserva: Reserva): Promise<Reserve> {
    throw new Error("Method not implemented.");
  }
  actualizar(id: number, hourstart: string, hourend: string, date: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  eliminar(id: number): Promise<boolean> {
    return Promise.resolve(true);
  }
  buscarReservaPorId(id: number): Promise<Reserve> {
    throw new Error("Method not implemented.");
  }
  buscarReservasPorEspacioyFecha(idEspacio: string, fecha: string): Promise<Reserve[]> {
    throw new Error("Method not implemented.");
  }
  



}