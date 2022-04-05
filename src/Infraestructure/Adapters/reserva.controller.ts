import {
  servicioReservaI,
  ReservaService,
} from '../../Mooc/Reserva/Application/reserva.service';
import { DatosReservaProps } from '../../Mooc/Reserva/Domain/Entities/datosreserva';
import { Espacio, EspacioProps } from '../../Mooc/Espacio/Domain/Entities/espacio';
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

@Controller()
export class AMQPController{
  
  //Constructor inyeccion de dependencias de todos los servicios de aplicación que sean necesarios.
  constructor(
    @Inject('servicioReservaI') private readonly servicioReservas: servicioReservaI,
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
    const reservaprops: DatosReservaProps = {
      fecha: new Date().toString(),
      horaInicio: '10:00',
      horaFin: '12:00',
      Persona: 'Sergio',
    };
    let id: ShortDomainId = ShortDomainId.create(
      crypto.randomBytes(64).toString('hex'),
    );
    const espacioprops: EspacioProps = {
      Name: 'hola',
      Capacity: 15,
      Building: 'Ada',
      Kind: 'Sanidad',
    };
    //Devuelve lo que tenga que devolver en formato JSON.
    let resultadoOperacion: Reserve = await this.servicioReservas.guardarReserva(reservaprops,espacioprops);
    console.log(resultadoOperacion)
    return resultadoOperacion;
  }

  @MessagePattern('buscar-reserva-por-id')
  async buscarReservaPorId(
    @Payload() data: number[],
    @Ctx() context: RmqContext,
  ) {
 
  }

  @MessagePattern('buscar-reserva-por-espacio')
  async buscarReservaPorEspacio(
    @Payload() data: number[],
    @Ctx() context: RmqContext,
  ) {
   
  }

  @MessagePattern('recibir-reserva')
  async TesteitoReservas(
    @Payload() data: number[],
    @Ctx() context: RmqContext,
  ) {

    const reservaprops: DatosReservaProps = {
      fecha: new Date().toISOString(),
      horaInicio: '10:00',
      horaFin: '12:00',
      Persona: 'Sergio',
    };
    return reservaprops
  }


}
