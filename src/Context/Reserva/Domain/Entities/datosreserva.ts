import { assert } from 'console';
import { ValueObject } from 'types-ddd';
import ReservaException from '../reservaexception';
import { ReservaRepository } from '../ReservaRepository';
import { PoliticaReserva } from './politica_reserva';
import { Reserve } from '../../../../Infraestructure/Persistence/reserva.entity';

export interface DatosReservaProps {
  readonly horaInicio: number;
  horaFin?: number;
  readonly fecha: string;
  readonly Persona: string;
  readonly evento: string;
}

export class DatosReserva {
  private constructor(private propsReserva: DatosReservaProps) {}
  /**
   * Forzamos una validación contra la lógica de dominio utilizando un constructor
   * privado. Se debe llamar a este método que comprobara la lógica de dominio.
   *
   * @param props datos de una reserva
   * @returns Crea una reserva si se cumple con la "PoliticaReserva", sino lanza un error.
   */
  public static async createDatosReserva(
    props: DatosReservaProps,
    repo: ReservaRepository,
  ): Promise<DatosReserva> {
    //Comprobamos si se cumple la politica de reserva
    if (await PoliticaReserva.seCumple(props, repo)) {
      //Si se cumple la política se crea el objeto datosRserva
      return new DatosReserva(props);
    } else {
      throw new ReservaException(ReservaException.WRONG_RESERVE_MSG);
    }
  }

  public static rehidratarDatosReservaFromDB(
    reservasDTO: Reserve[],
  ): DatosReserva[] {
    const datosreserva: DatosReserva[] = reservasDTO.map((reserva, indice) => {
      return new DatosReserva({
        horaInicio: Number(reserva.horainicio),
        fecha: reserva.fecha,
        Persona: reserva.persona,
        evento: reserva.evento,
      });
    });
    return datosreserva;
  }

  public calcularHoraFin(duracion: number): void {
    assert(duracion >= 0 && duracion % 60 === 0, 'Duración no valida.');
    this.propsReserva.horaFin = this.propsReserva.horaInicio + duracion / 60;
  }

  public getProps(): DatosReservaProps {
    return this.propsReserva;
  }
}
