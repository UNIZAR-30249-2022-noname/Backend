import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices/module';
import { Transport } from '@nestjs/microservices';
import {ReservaService,servicioReservaI} from './Mooc/Reserva/Application/reserva.service'
import {ReservasMQAdapter} from './Mooc/Reserva/Infraestructure/reserva.controller'
import {ReservaRepoPGImpl} from './Mooc/Reserva/Infraestructure/ReservaRepoImpl'

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'RESERVAS_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqps://draayoqu:7lDJ4nHZhhKGUn2lQCvw8XE4VNuVxMvD@rat.rmq2.cloudamqp.com/draayoqu'],
          queue: 'reservas_queue',
          queueOptions: {
            durable: true, //garantiza persistencia de mensajes cuando se apaga la cola
            noAck: true //ack auto
          },
        },
      },
      
    ]),
  ],
  controllers: [ReservasMQAdapter],
  providers: [
    {
      provide: 'servicioReservaI',
      useClass: ReservaService,
    },
    {
      provide: 'ReservaRepository',
      useClass: ReservaRepoPGImpl,
    }
  ],
})

export class AppModule {}