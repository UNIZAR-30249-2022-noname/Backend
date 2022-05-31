import { Injectable } from '@nestjs/common';
import { ReservasOcupadasDTO } from 'src/Context/Reserva/Application/reservasOcupadasDTO';
import { DatosReservaProps } from 'src/Context/Reserva/Domain/Entities/datosreserva';
import { Reserve } from '../src/Infraestructure/Persistence/reserva.entity';
import { servicioReservaI } from '../src/Context/Reserva/Application/reserva.service';
import * as fake_data from './test-data/data';
import ReservaException from '../src/Context/Reserva/Domain/reservaexception';

@Injectable()
export class MockReservaService implements servicioReservaI {
  obtenerReservasUsuario(usuario: string): Promise<any[]> {
    throw new Error('Method not implemented.');
  }
  obtenerReservasEspacio(
    idEspacio: string,
    fecha: string,
  ): Promise<ReservasOcupadasDTO[]> {
    throw new Error('Method not implemented.');
  }
  guardarReserva(
    datosreserva: DatosReservaProps,
    idEspacio: string,
  ): Promise<Reserve> {
    const new_id = check(
      rangoHorasCorrecto(datosreserva) &&
        horaInicioEsMayorQueHoraFin(datosreserva) &&
        duraUnaHora(datosreserva),
    );
    if (new_id != -1) {
      const new_id = fake_data.reservas.at(-1).id + 1;
      const object = {
        datosreserva,
        id: new_id + 1,
      };
      fake_data.reservas.push(object);
    }
    const reserva_devuelta = new Reserve();
    reserva_devuelta.id = new_id;
    return Promise.resolve(reserva_devuelta);
  }
  eliminarReserva(idReserva: string): Promise<boolean> {
    const find_result = fake_data.reservas.find((e) => {
      e.id === idReserva;
    });
    return Promise.resolve(find_result != undefined);
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

function check(condition: boolean): number {
  if (!condition) {
    return -1;
  }
  return 0;
}
