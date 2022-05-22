import { Module } from '@nestjs/common';
import { EspacioService } from '../Mooc/Espacio/Application/usecase/espacio.service';
import dataSource from '../Config/ormconfig_db';
import { ReservaService } from '../Mooc/Reserva/Application/reserva.service';
import { ReservaRepoPGImpl } from '../Mooc/Reserva/Infraestructure/reserva.repository';
import { TestController } from './Adapters/testhttp.controller';
import { EspacioRepoPGImpl } from '../Mooc/Espacio/Infraestructure/espacio.repository';
import { IncidenciaService } from '../Mooc/Incidencia/Application/usecase/incidencia.service';
import { IncidenciaRepoPGImpl } from '../Mooc/Incidencia/Infraestructure/incidencia.repository';
import { HorarioService } from '../Mooc/Horario/Application/usecase/horario.service';
import { HorarioRepoPGImpl } from '../Mooc/Horario/Infraestructure/horario.repository';

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
      provide: 'servicioEspacioI',
      useClass: EspacioService,
    },
    {
      provide: 'EspacioRepository',
      useClass: EspacioRepoPGImpl,
    },
    {
      provide: 'DataSrc',
      useValue: dataSource,
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
export class TestHttpModule {}
