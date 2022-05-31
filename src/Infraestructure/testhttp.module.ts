import { Module } from '@nestjs/common';
import { EspacioService } from '../Context/Espacio/Application/usecase/espacio.service';
import dataSource from '../Config/ormconfig_db';
import { ReservaService } from '../Context/Reserva/Application/reserva.service';
import { ReservaRepoPGImpl } from '../Context/Reserva/Infraestructure/reserva.repository';
import { TestController } from './Adapters/testhttp.controller';
import { EspacioRepoPGImpl } from '../Context/Espacio/Infraestructure/espacio.repository';
import { IncidenciaService } from '../Context/Incidencia/Application/usecase/incidencia.service';
import { IncidenciaRepoPGImpl } from '../Context/Incidencia/Infraestructure/incidencia.repository';
import { HorarioService } from '../Context/Horario/Application/usecase/horario.service';
import { HorarioRepoPGImpl } from '../Context/Horario/Infraestructure/horario.repository';

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
