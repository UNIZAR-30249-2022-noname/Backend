import ReservaException from '../reservaexception';
import { ReservaRepository } from '../ReservaRepository';
import { DatosReservaProps } from './datosreserva';
import { Assert } from '../../../../shared/assert';

/*function Assert(condition: boolean, message: string) {
  if (!condition) {
    throw new ReservaException(message || 'Assertion failed');
  }
}*/

export abstract class PoliticaReserva {
  /**
   * Pre: Una reserva solo es realizable si la hora de fin es superior a la hora de inicio,
   * si la reserva es de una única hora de duración, y si el intervalo de reserva está entre 8<=h<=21.
   * Post: devuelve verdad si la reserva cumple las condiciones de reserva y si no existe una reserva
   * en una fecha y hora ya reservadas.
   */
  public static async seCumple(
    props: DatosReservaProps,
    repo: ReservaRepository,
  ): Promise<boolean> {
    //Comprobar Precondición.
    Assert(
      rangoHorasCorrecto(props) &&
        horaInicioEsMayorQueHoraFin(props) &&
        duraUnaHora(props),
      ReservaException.WRONG_RESERVE_MSG,
    );
    // Llamar al repositorio y obtener los datos correspondientes a la reserva a partir de props.
    // Comprobar si existe una solapación contra otro horario entre horaIni y horaFin en esa fecha.
    const resultado = await repo.buscarReservaPorFechayHora(
      String(props.horaInicio),
      props.fecha,
    );
    // Si no existe una solapación (resultado = null) devolver verdadero, si existe devolver falso.
    return resultado == null;
  }
}
/*
 * Conjunto de funciones privadas que validan la precondición.
 */
function duraUnaHora(props: DatosReservaProps): boolean {
  return props.horaFin - props.horaInicio == 1;
}

function horaInicioEsMayorQueHoraFin(props: DatosReservaProps): boolean {
  return props.horaFin > props.horaInicio;
}

function rangoHorasCorrecto(props: DatosReservaProps): boolean {
  return (
    props.horaInicio >= 8 &&
    props.horaInicio <= 20 &&
    props.horaFin >= 9 &&
    props.horaFin <= 21
  );
}
