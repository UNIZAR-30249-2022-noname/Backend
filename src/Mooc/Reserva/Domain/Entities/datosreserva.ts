import { assert } from 'console';
import { ValueObject } from 'types-ddd';
import { PoliticaReserva } from './politica_reserva';

export interface DatosReservaProps {
  readonly horaInicio: number;
  horaFin?: number;
  readonly fecha: string;
  readonly Persona: string;
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
  public static createDatosReserva(props: DatosReservaProps): DatosReserva {
    if (PoliticaReserva.seCumple(props)) {
      //Si se cumple la política se crea el objeto datosRserva
      return new DatosReserva(props);
    } else {
      throw new Error('Error al crear la reserva.');
    }
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
