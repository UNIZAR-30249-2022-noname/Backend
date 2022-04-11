import {
  servicioReservaI,
  ReservaService,
} from '../../Mooc/Reserva/Application/reserva.service';
import { DatosReservaProps } from '../../Mooc/Reserva/Domain/Entities/datosreserva';
import { Espacio} from '../../Mooc/Espacio/Domain/Entities/espacio';
import { DomainId, ShortDomainId } from 'types-ddd';
import * as crypto from 'crypto';
import { Controller, Inject } from '@nestjs/common';
import {
  ClientProxy,
  MessagePattern,
  RmqContext,
  Payload,
  Ctx,
} from '@nestjs/microservices';
import {Reserve}  from 'src/Mooc/Reserva/Domain/Entities/reserva.entity';
import { servicioEspacioI } from 'src/Mooc/Espacio/Application/usecase/espacio.service';

@Controller()
export class AMQPController{
  
  //Constructor inyeccion de dependencias de todos los servicios de aplicación que sean necesarios.
  constructor(
    @Inject('servicioReservaI') private readonly servicioReservas: servicioReservaI,
    @Inject('servicioEspacioI') private readonly servicioEspacios: servicioEspacioI
  ) {}

  //Endpoint para recibir una realización de una reserva
  @MessagePattern('realizar-reserva')
  async realizarReservas(
    @Payload() data: number[],
    @Ctx() context: RmqContext,
  ) {
    
    //Convierte el mensaje en un Objeton JSON.
    const mensajeRecibido = JSON.parse(context.getMessage().content);
    console.log('Procesando Solicitud(realizar-resreva)', mensajeRecibido);
    const horainicio = mensajeRecibido.body.Scheduled[0].Hour
    const horafin = mensajeRecibido.body.Scheduled[1].Hour 
    const evento: string = mensajeRecibido.body.event
    const reservaprops: DatosReservaProps = {
      fecha: mensajeRecibido.body.Day,
      horaInicio: horainicio,
      horaFin: horafin,
      Persona: mensajeRecibido.body.owner,
    };
    const idEspacio: string = mensajeRecibido.space;
    const duracion: number = mensajeRecibido.Reserva.InitHour.min
    //Devuelve lo que tenga que devolver en formato JSON.
    let resultadoOperacion: Reserve = await this.servicioReservas.guardarReserva(reservaprops,idEspacio,duracion);
    console.log(resultadoOperacion)
    return {id: resultadoOperacion.id, CorrelationId: mensajeRecibido.id };
  }

  @MessagePattern('buscar-reserva-por-id')
  async buscarReservaPorId(
    @Payload() data: number[],
    @Ctx() context: RmqContext,
  ) {
    const mensajeRecibido = JSON.parse(context.getMessage().content);
    //this.servicioEspacios.filtrarEspacios()
    return true;
  }

  @MessagePattern('filtrar-espacios')
  async buscarReservaPorEspacio(
    @Payload() data: number[],
    @Ctx() context: RmqContext,
  ) {
   
  }


  @MessagePattern('importar-espacios')
  async importarEspacios(
    @Payload() data: number[],
    @Ctx() context: RmqContext,
  ) {
    // TODO: FALTA CONVERTIR EL BINARIO DE RABBIT A CSV Y PASARSELO A importarEspacios. ACTUALMENTE COGE AUTOMÁTICAMENTE EL TB_ESPACIOS.csv
    const resultadoOperacionInsertar = await this.servicioEspacios.importarEspacios();
    return resultadoOperacionInsertar;
  }
}
