import { assert } from 'console';
import { ValueObject } from 'types-ddd';
import ReservaException from '../reservaexception';
import { PoliticaReserva } from './politica_reserva';
import { Reserve } from './reserva.entity';

export interface DatosReservaProps {
  readonly horaInicio: number;
  horaFin?: number;
  readonly fecha: string;
  readonly Persona: string
  readonly evento: string;
}

export class DatosReserva{

  private constructor(private propsReserva: DatosReservaProps) { }
  /**
   * Forzamos una validación contra la lógica de dominio utilizando un constructor
   * privado. Se debe llamar a este método que comprobara la lógica de dominio.
   *
   * @param props datos de una reserva
   * @returns Crea una reserva si se cumple con la "PoliticaReserva", sino lanza un error.
   */
  public static async createDatosReserva(props: DatosReservaProps): Promise<DatosReserva> {
    //Comprobamos si se cumple la politica de reserva
    if ((await PoliticaReserva.seCumple(props))) {
      //Si se cumple la política se crea el objeto datosRserva
      return new DatosReserva(props);
    } else {
      throw new ReservaException(ReservaException.WRONG_RESERVE_MSG);
    }
  }
  
  public static rehidratarDatosReservaFromDB(reservasDTO: Reserve[]): DatosReserva[] {
    var datosreserva: DatosReserva[] = reservasDTO.map( (reserva, indice) => {
        return new DatosReserva({
          horaInicio: Number(reserva.horainicio),
          fecha: reserva.fecha,
          Persona: reserva.persona,
          evento: reserva.evento,
        })
    })
    return datosreserva;
  }

  public calcularHoraFin(duracion: number): number {
    assert( duracion >= 0 && duracion % 60 === 0,"Duración no valida.")
    this.propsReserva.horaFin = this.propsReserva.horaInicio + (duracion / 60)
    return this.propsReserva.horaFin;   
  }

  public getProps(): DatosReservaProps {
    return this.propsReserva;
  }
}
