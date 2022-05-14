import { Module } from '@nestjs/common';
import dataSource from '../Config/ormconfig_db';
import { ReservaService } from '../Mooc/Reserva/Application/reserva.service';
import { ReservaRepoPGImpl } from '../Mooc/Reserva/Infraestructure/reserva.repository';
import { TestController } from './Adapters/testhttp.controller';

@Module({
  controllers: [TestController],
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
      useValue: dataSource
    },
  ]
})
export class TestHttpModule{}