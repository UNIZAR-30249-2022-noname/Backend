import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices/module';
import { Transport } from '@nestjs/microservices';
import {
  ReservaService,
  servicioReservaI,
} from './Mooc/Reserva/Application/reserva.service';
import { AMQPController } from './Mooc/Reserva/Infraestructure/reserva.controller';
import { ReservaRepoPGImpl } from './Mooc/Reserva/Infraestructure/ReservaRepoImpl';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'REPLY_CLIENT',
        transport: Transport.RMQ,
        options: {
          urls: [
            'amqps://cnvzbkyj:zrT84snzxNyFwAZl1MV2vI9Gg8OtjiRV@whale.rmq.cloudamqp.com/cnvzbkyj',
          ],
          queue: 'request',
          queueOptions: {
            durable: false, //garantiza persistencia de mensajes cuando se apaga la cola
            noAck: true, //ack auto
          },
        },
      },
    ]),
  ],
  controllers: [AMQPController],
  providers: [
    {
      provide: 'servicioReservaI',
      useClass: ReservaService,
    },
    {
      provide: 'ReservaRepository',
      useClass: ReservaRepoPGImpl,
    },
  ],
})
export class AppModule {}
