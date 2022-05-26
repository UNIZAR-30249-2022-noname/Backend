import { DatosReserva } from '../Domain/Entities/datosreserva';
import { Reserve } from '../Domain/Entities/reserva.entity';
import { ReservasOcupadasDTO } from './reservasOcupadasDTO';
import { ReservasUsuarioDTO, Scheduled } from './reservasUsuarioDTO';

export abstract class ReservaAssembler {
  public static WriteDto(datosReserva: DatosReserva[]): ReservasOcupadasDTO[] {
    const listadoReservasEspacio: ReservasOcupadasDTO[] =
      new Array<ReservasOcupadasDTO>(13).fill(undefined).map((_, index) => {
        // Busca si alguno de los objetos del dominio con los que se instancia el DTO cumple que estén reservados a esa hora
        const datosReservaExisten = datosReserva.find(
          (datosreserva) => datosreserva.getProps().horaInicio == index + 8,
        );
        return new ReservasOcupadasDTO(
          //Hora inicio (hora).
          index + 8,
          //Está ocupada o no en esa hora (busy/ocupado).
          datosReservaExisten !== undefined,
          // Quién lo ha ocupado (persona).
          datosReservaExisten !== undefined
            ? datosReservaExisten.getProps().Persona
            : '',
          //Evento de la reserva.
          datosReservaExisten !== undefined
            ? datosReservaExisten.getProps().evento
            : '',
        );
      });
    return listadoReservasEspacio;
  }

  public static WriteDTOReserve(listadoReservas: any[]){
    const DTOReserve: ReservasUsuarioDTO[] = listadoReservas.map( (reserva) => {
        return new ReservasUsuarioDTO(
            reserva.name,
            reserva.fecha,
            reserva.evento,
            [new Scheduled(Number(reserva.horainicio),60),new Scheduled(Number(reserva.horafin),0)],
            reserva.persona,
            String(reserva.id),
        )
    })
    return DTOReserve;
  }
}
