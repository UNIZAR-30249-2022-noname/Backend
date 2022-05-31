import { ReservaService } from '../src/Context/Reserva/Application/reserva.service';
import { MockReservaService } from './mockReservaRepository';
import { EspacioService } from '../src/Context/Espacio/Application/usecase/espacio.service';
import { IncidenciaService } from '../src/Context/Incidencia/Application/usecase/incidencia.service';
import { EspacioRepoPGImpl } from '../src/Context/Espacio/Infraestructure/espacio.repository';
import { IncidenciaRepoPGImpl } from '../src/Context/Incidencia/Infraestructure/incidencia.repository';
import { ReservaRepoPGImpl } from '../src/Context/Reserva/Infraestructure/reserva.repository';
import dataSource from '../src/Config/ormconfig';
import { HorarioService } from '../src/Context/Horario/Application/usecase/horario.service';
import { HorarioRepoPGImpl } from '../src/Context/Horario/Infraestructure/horario.repository';

let providers: any = undefined;
export const it_cond = process.env.MOCKED === 'mocked-test' ? it.skip : it;
switch (process.env.MOCKED) {
  case 'mocked-test':
    providers = [
      {
        provide: 'servicioReservaI',
        useClass: MockReservaService,
      },
      {
        provide: 'servicioEspacioI',
        useClass: EspacioService,
      },
      {
        provide: 'servicioIncidenciaI',
        useClass: IncidenciaService,
      },
      {
        provide: 'servicioHorarioI',
        useClass: HorarioService,
      },
      {
        provide: 'EspacioRepository',
        useClass: EspacioRepoPGImpl,
      },
      {
        provide: 'IncidenciaRepository',
        useClass: IncidenciaRepoPGImpl,
      },
      {
        provide: 'HorarioRepository',
        useClass: HorarioRepoPGImpl,
      },
      {
        provide: 'DataSrc',
        useValue: dataSource,
      },
    ];
    break;
  default:
    providers = [
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
    ];
    break;
}

export default providers;
