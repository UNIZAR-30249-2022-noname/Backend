import { RabbitMQAdapter } from '../../../Infraestructure/Adapters/RabbitMQAdapter';
import client, { Channel, Connection, ConsumeMessage } from 'amqplib';
import { RabbitMQConfig } from '../../../Configuration/RabbitMQConfig';
import {
  servicioReservaI,
  ReservaService,
} from '../Application/reserva.service';
import { ReservaRepoPGImpl } from './ReservaRepoImpl';
import { DatosReservaProps } from '../Domain/Entities/datosreserva';
import { Espacio, EspacioProps } from '../../Espacio/Domain/Entities/espacio';
import { DomainId, ShortDomainId } from 'types-ddd';

import * as crypto from 'crypto';
import { Controller, Inject } from '@nestjs/common';
import {
  ClientProxy,
  MessagePattern,
  RmqContext,
  Payload,
  Ctx,
  EventPattern,
} from '@nestjs/microservices';

@Controller()
export class ReservasMQAdapter {
  //Constructor inyeccion de dependencias de todos los servicios de aplicación que sean necesarios.
  constructor(
    @Inject('servicioReservaI')
    private readonly servicioReservas: servicioReservaI,
  ) {}
  //    @Inject('RESERVAS_SERVICE') private readonly client: ClientProxy){ }

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
      Fecha: new Date().toISOString(),
      HoraInicio: '10:00',
      HoraFin: '12:00',
      Persona: 'Sergio',
    };
    let id: ShortDomainId = ShortDomainId.create(
      crypto.randomBytes(64).toString('hex'),
    );
    const espacioprops: EspacioProps = {
      ID: id,
      Name: 'hola',
      Capacity: 15,
      Building: 'Ada',
      Kind: 'Sanidad',
    };
    //let resultadoOperacion = await this.servicioReservas.guardarReserva(reservaprops,espacioprops)
    //console.log(resultadoOperacion)
  }

  @MessagePattern()
  recibirPeticionesReserva(
    @Payload() data: number[],
    @Ctx() context: RmqContext,
  ) {
    //const messageID:string = context.getArgs()[0].properties.messageId;
    console.warn('Mensaje recibido sin ningun parametro.');
  }
}
