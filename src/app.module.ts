import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices/module';
import { Transport } from '@nestjs/microservices';
import {
  ReservaService,
  servicioReservaI,
} from './Context/Reserva/Application/reserva.service';
import { AMQPController } from './Infraestructure/Adapters/rabbit.controller';
import { ReservaRepoPGImpl } from './Context/Reserva/Infraestructure/reserva.repository';
import { EspacioRepoPGImpl } from './Context/Espacio/Infraestructure/espacio.repository';
import { EspacioService } from './Context/Espacio/Application/usecase/espacio.service';
import { IncidenciaRepoPGImpl } from './Context/Incidencia/Infraestructure/incidencia.repository';
import { IncidenciaService } from './Context/Incidencia/Application/usecase/incidencia.service';
import { HorarioService } from './Context/Horario/Application/usecase/horario.service';
import { HorarioRepoPGImpl } from './Context/Horario/Infraestructure/horario.repository';
import dataSource from './Config/ormconfig_db';

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
    {
      provide: 'DataSrc',
      useValue: dataSource,
    },
    {
      provide: 'servicioEspacioI',
      useClass: EspacioService,
    },
    {
      provide: 'EspacioRepository',
      useClass: EspacioRepoPGImpl,
    },
    {
      provide: 'servicioIncidenciaI',
      useClass: IncidenciaService,
    },
    {
      provide: 'IncidenciaRepository',
      useClass: IncidenciaRepoPGImpl,
    },
    {
      provide: 'servicioHorarioI',
      useClass: HorarioService,
    },
    {
      provide: 'HorarioRepository',
      useClass: HorarioRepoPGImpl,
    }
  ],
})
export class AppModule {}
