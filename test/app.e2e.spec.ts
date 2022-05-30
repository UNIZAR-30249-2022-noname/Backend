import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, INestMicroservice } from '@nestjs/common';
import request from 'supertest';
import { TestHttpModule } from '../src/Infraestructure/testhttp.module';
import { AMQPController } from '../src/Infraestructure/Adapters/rabbit.controller';
import { RmqContext } from '@nestjs/microservices';
import { RabbitContextArgs, Args } from './RabbitContextArgs';
import providers from './config';
import dataSource from '../src/Config/ormconfig';
import { Reserve } from '../src/Mooc/Reserva/Domain/Entities/reserva.entity';
import { expectedOuputT3, actualizarHorarioInput } from './test-data/data';
import { it_cond } from './config';
import { Issue } from '../src/Mooc/Incidencia/Domain/Entities/incidencia.entity';
import { Entry } from '../src/Mooc/Horario/Domain/Entities/entrada.entity';
import { Degree } from '../src/Mooc/Horario/Domain/Entities/titulacion.entity';
import { Subject } from '../src/Mooc/Horario/Domain/Entities/asignatura.entity';

function sleep(milliseconds: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

const jestConsole = console;

describe('AMQPController (e2e)', () => {
  let app: INestApplication;
  let testapp: AMQPController;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestHttpModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    //Controlador Rabbit
    const moduleTest: TestingModule = await Test.createTestingModule({
      controllers: [AMQPController],
      providers: providers,
    }).compile();

    testapp = moduleTest.get(AMQPController);
    global.console = require('console');
    if (!dataSource.isInitialized) await dataSource.initialize();
  });

  afterAll(async () => {
    global.console = jestConsole;
    await dataSource.destroy();
  });

  it_cond('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/test/prueba')
      .expect(200)
      .expect('Hello World');
  });

  it_cond('AmqpController should be defined', () => {
    expect(testapp).toBeDefined();
  });

  describe('Test-Reservas', () => {
    it_cond(
      'Crear una reserva debería devolver el id de la reserva que se ha creado.',
      async () => {
        //Argumentos a mandar para cancelar la reserva
        const argsReserva = {
          body: {
            day: '02-05-1915',
            owner: 'Me',
            event: 'Reserva aula',
            space: 'CRE.1065.00.640',
            scheduled: [{ hour: 10, min: 60 }],
          },
        };

        const args: Args = RabbitContextArgs.construirArgs(
          JSON.stringify(argsReserva),
          null,
          'cancelar-reserva',
        );
        //Esperamos que se inicialicen todos los repositorios
        await sleep(1000);
        const resultadoJSON = await realizarR(testapp, new RmqContext(args));
        const querybuilder = dataSource.createQueryBuilder(Reserve, 'reserve');
        //Buscamos que el id devuelvo para la nueva reserva creada exista y lo devolvemos.
        const idEncontrado = await querybuilder
          .select('id', 'idreserva')
          .where('reserve.id = :id', { id: resultadoJSON.resultado })
          .printSql()
          .getRawOne();
        //Comprobamos que coincide el id de la reserva realizada con el id encontrado, es decir se ha hecho la reserva.
        expect(idEncontrado.idreserva).toBe(resultadoJSON.resultado);
        //Borramos la reserva de la base de datos para no dejar rastro.
        querybuilder
          .delete()
          .from(Reserve)
          .where('id = :id', { id: resultadoJSON.resultado })
          .execute();
      },
      20000,
    );

    it_cond(
      'Cancelar reserva debería devolver false con una reserva no existente.',
      async () => {
        //Argumentos a mandar para cancelar la reserva
        const argsObject = {
          body: {
            id: -5,
          },
        };
        const args: Args = RabbitContextArgs.construirArgs(
          JSON.stringify(argsObject),
          null,
          'cancelar-reserva',
        );
        //Esperamos que se inicialicen todos los repositorios
        await sleep(1000);
        const resultadoJSON = await cancelarR(testapp, new RmqContext(args));
        expect(resultadoJSON.resultado).toBe(false);
      },
      20000,
    );

    it_cond(
      'Cancelar reserva debería devolver true con una reserva existente.',
      async () => {
        const argsReserva = {
          body: {
            day: '13-05-1915',
            owner: 'Me',
            event: 'Reserva aula',
            space: 'CRE.1065.00.640',
            scheduled: [{ hour: 8, min: 60 }],
          },
        };

        const argsCrearReserva: Args = RabbitContextArgs.construirArgs(
          JSON.stringify(argsReserva),
          null,
          'realizar-reserva',
        );
        //Esperamos que se inicialicen todos los repositorios
        await sleep(1000);
        const resultadoreserva = await realizarR(
          testapp,
          new RmqContext(argsCrearReserva),
        );
        //Argumentos a mandar para cancelar la reserva
        const argsObject = {
          body: {
            id: resultadoreserva.resultado,
          },
        };
        const args: Args = RabbitContextArgs.construirArgs(
          JSON.stringify(argsObject),
          null,
          'cancelar-reserva',
        );
        const resultadoJSON = await cancelarR(testapp, new RmqContext(args));
        expect(resultadoJSON.resultado).toBe(true);
      },
      25000,
    );
  });

  describe('Tests-Espacios', () => {
    it_cond(
      'Filtrar los espacios del Ada Byron con capacidad 0 de todas las plantas debería devolver 316 espacios.',
      async () => {
        const argsFiltrado = {
          body: {
            capacity: '0',
            building: 'Ada Byron',
            floor: '',
            day: '',
            hour: { hour: 0, min: 0 },
          },
        };

        const argsFiltrarReserva: Args = RabbitContextArgs.construirArgs(
          JSON.stringify(argsFiltrado),
          null,
          'filtrar-espacios',
        );
        //Esperamos que se inicialicen todos los repositorios
        //await sleep(3000)
        const resultadofiltrado = await filtrarEsp(
          testapp,
          new RmqContext(argsFiltrarReserva),
        );
        expect(resultadofiltrado.resultado.length).toEqual(316);
      },
      25000,
    );

    it_cond(
      'Filtrar los espacios del Ada Byron con capacidad mayor que 1, no debería devolver el espacio reservado.',
      async () => {
        const argsFiltrado = {
          body: {
            capacity: '1',
            building: 'Ada Byron',
            floor: 'Primera',
            day: '13-05-1920',
            hour: { hour: 17, min: 60 },
          },
        };

        const argsReserva = {
          body: {
            day: '13-05-1920',
            owner: 'Me',
            event: 'Reservar aula',
            space: 'CRE.1200.01.030', //Aula A.11
            scheduled: [{ hour: 17, min: 60 }],
          },
        };
        const argsCrearReserva: Args = RabbitContextArgs.construirArgs(
          JSON.stringify(argsReserva),
          null,
          'realizar-reserva',
        );
        const argsFiltrarReserva: Args = RabbitContextArgs.construirArgs(
          JSON.stringify(argsFiltrado),
          null,
          'filtrar-espacios',
        );
        //Esperamos que se inicialicen todos los repositorios
        await sleep(1000);
        const resultadoreserva = await realizarR(
          testapp,
          new RmqContext(argsCrearReserva),
        );
        const resultadofiltrado = await filtrarEsp(
          testapp,
          new RmqContext(argsFiltrarReserva),
        );
        //Comprobamos que el ID del espacio reservado no es devuelto a la hora de filtrar.
        resultadofiltrado.resultado.map((espacio) => {
          expect(espacio.id).not.toEqual(argsReserva.body.space);
        });
        //Borramos la reserva.
        const querybuilder = dataSource.createQueryBuilder(Reserve, 'reserve');
        await querybuilder
          .delete()
          .from(Reserve)
          .where('id = :id', { id: resultadoreserva.resultado })
          .execute();
      },
      25000,
    );

    it_cond(
      'Obtener las reservas de un espacio.',
      async () => {
        const argsEspacios = {
          body: {
            id: 'CRE.1200.01.030',
            date: '13-05-1925',
          },
        };

        const argsReserva = {
          body: {
            day: '13-05-1925',
            owner: 'Usuario',
            event: 'Reservar aula',
            space: 'CRE.1200.01.030', //Aula A.11
            scheduled: [{ hour: 18, min: 60 }],
          },
        };

        const argsCrearReserva: Args = RabbitContextArgs.construirArgs(
          JSON.stringify(argsReserva),
          null,
          'realizar-reserva',
        );
        const argsObtenerEspacios: Args = RabbitContextArgs.construirArgs(
          JSON.stringify(argsEspacios),
          null,
          'obtener-informacion-espacio',
        );
        //Esperamos que se inicialicen todos los repositorios
        await sleep(1000);
        await realizarR(testapp, new RmqContext(argsCrearReserva));
        const resultadoreservas = await obtenerEsp(
          testapp,
          new RmqContext(argsObtenerEspacios),
        );
        expect(resultadoreservas.resultado.InfoSlots).toEqual(expectedOuputT3);
      },
      25000,
    );
  }); //Fin test espacios

  describe('Tests-Incidencias', () => {
    it_cond(
      'Crear una incidencia.',
      async () => {
        const argsIncidencias = {
          body: {
            title: "Proyector roto",
            description: "El proyecto no funciona.",
            state: 0,
            tags: ["reparacion"],
            space: 'CRE.1200.01.030',
          },
        };


        const argsCrearIncidencia: Args = RabbitContextArgs.construirArgs(
          JSON.stringify(argsIncidencias),
          null,
          'crear-incidencia',
        );
        //Esperamos que se inicialicen todos los repositorios
        await sleep(1000);
        const resultadoJSON = await realizarIssue(testapp, new RmqContext(argsCrearIncidencia));
        const querybuilder = dataSource.createQueryBuilder(Issue, 'issue');
        //Buscamos que el id devuelvo para la nueva reserva creada exista y lo devolvemos.
        const issue_encontrada = await querybuilder
          .where('issue.id = :id', { id: resultadoJSON.resultado })
          .printSql()
          .getRawOne();
        //Comprobamos que coincide el id de la incidencia realizada con el id encontrado, es decir se ha hecho la reserva.
        expect(issue_encontrada.issue_id).toBe(resultadoJSON.resultado);
        expect(issue_encontrada.issue_titulo).toBe(argsIncidencias.body.title);
        //Borramos la incidencia de la base de datos para no dejar rastro.
        await querybuilder
          .delete()
          .from(Issue)
          .where('id = :id', { id: resultadoJSON.resultado })
          .execute();
      },
      25000,
    );

    it_cond('Eliminar una incidencia existente debería devolver el id de la incidencia eliminada y nunca -1.', async () => {
      
        const CrearIncidencia = {
          body: {
            title: "Proyector averiado",
            description: "Problemas al proyectar",
            state: 0,
            tags: ["reparacion"],
            space:'CRE.1200.01.030',
          },
        };


        const argsCrearIncidencia: Args = RabbitContextArgs.construirArgs(
          JSON.stringify(CrearIncidencia),
          null,
          'crear-incidencia',
        );
        //Esperamos que se inicialicen todos los repositorios
        await sleep(1000);
        const resultado_crearIssue = await realizarIssue(testapp, new RmqContext(argsCrearIncidencia));
        const argsEliminarIncidencias = {
          body: {
            key: resultado_crearIssue.resultado,
          }
        }
        const argsEliminarIncidencia: Args = RabbitContextArgs.construirArgs(
          JSON.stringify(argsEliminarIncidencias),
          null,
          'eliminar-incidencia',
        );
        const resultadoJSON = await cancelarIssue(testapp, new RmqContext(argsEliminarIncidencia));
        expect(resultadoJSON.resultado).not.toBe(-1);
        expect(resultadoJSON.resultado).toBe(resultado_crearIssue.resultado)
      }
    )

    it_cond('Eliminar una incidencia no existente debería devolver -1', async () => {
      const argsIncidencias = {
        body: {
          key: -15,
        }
      }
      const argsEliminarIncidencia: Args = RabbitContextArgs.construirArgs(
        JSON.stringify(argsIncidencias),
        null,
        'eliminar-incidencia',
      );
      //Esperamos que se inicialicen todos los repositorios
      await sleep(1000);
      const resultadoJSON = await cancelarIssue(testapp, new RmqContext(argsEliminarIncidencia));
      expect(resultadoJSON.resultado).toBe(-1);
    }
  )

    it_cond('Descargar un reporte.', async () => {
      
      const argsDescarga = {
        body: 'Ada Byron'
      }

      const argsDescargar: Args = RabbitContextArgs.construirArgs(
        JSON.stringify(argsDescarga),
        null,
        'descargar-incidencias',
      );
      await sleep(1000);
      const resultadoJSON = await descargarPDF(testapp, new RmqContext(argsDescargar));
      expect(resultadoJSON.resultado).toBeInstanceOf(Buffer)

    })

    it_cond(
      'Modificar el estado de una incidencia.',
      async () => {

        const argsIncidencias = {
          body: {
            title: "Proyector roto",
            description: "El proyecto no funciona.",
            state: 0,
            tags: ["reparacion"],
            space: 'CRE.1200.00.040',
          },
        };

        const argsCrearIncidencia: Args = RabbitContextArgs.construirArgs(
          JSON.stringify(argsIncidencias),
          null,
          'crear-incidencia',
        );
        //Esperamos que se inicialicen todos los repositorios
        await sleep(1000);
        const resultadoJSON = await realizarIssue(testapp, new RmqContext(argsCrearIncidencia));
        const argsModificarIssue = {
          body: {
            key: resultadoJSON.resultado,
            state: 1,
          },
        };
        const argsModificarIncidencia: Args = RabbitContextArgs.construirArgs(
          JSON.stringify(argsModificarIssue),
          null,
          'modificar-estado-incidencia',
        );
        const resultadoModificarIssue = await modificarIssue(testapp, new RmqContext(argsModificarIncidencia));
        const querybuilder = dataSource.createQueryBuilder(Issue, 'issue');
        const issue_encontrada = await querybuilder
          .where('issue.id = :id', { id: resultadoJSON.resultado })
          .printSql()
          .getRawOne();
        //El estado debería ser 1 para esa incidencia
        expect(issue_encontrada.issue_estado).toBe(1)
        //Borramos la incidencia de la base de datos.
        await querybuilder
          .delete()
          .from(Issue)
          .where('id = :id', { id: resultadoJSON.resultado })
          .execute();

      },
      25000,
    );

    it_cond(
      'Obtener un listado de todas las incidencias.',
      async () => {

        const argsIncidencias = {
          body: {
            title: "Enchufe roto",
            description: "El enchufe no funciona.",
            state: 0,
            tags: ["reparacion"],
            space: 'CRE.1200.00.040',
          },
        };

        const argsCrearIncidencia: Args = RabbitContextArgs.construirArgs(
          JSON.stringify(argsIncidencias),
          null,
          'crear-incidencia',
        );
        //Esperamos que se inicialicen todos los repositorios
        await sleep(1000);
        const resultadoJSON = await realizarIssue(testapp, new RmqContext(argsCrearIncidencia));
        const argsObtenerIncidencias: Args = RabbitContextArgs.construirArgs(
          JSON.stringify({}),
          null,
          'obtener-incidencias',
        );
        const resultadoincidencias = await obtenerIssues(
          testapp,
          new RmqContext(argsObtenerIncidencias),
        );
        const querybuilder = dataSource.createQueryBuilder(Issue, 'issue');
        //Borramos la incidencia de la base de datos antes de que se acaben los tests.
        await querybuilder
          .delete()
          .from(Issue)
          .where('id = :id', { id: resultadoJSON.resultado })
          .execute();
        expect(resultadoincidencias.resultado.find(issue => parseInt(issue.key) === resultadoJSON.resultado)).toEqual({
          key: resultadoJSON.resultado.toString(),
          title: "Enchufe roto",
          description: "El enchufe no funciona.",
          state: 0,
          tags: ["reparacion"],
          space: 'AULA_A0.1',
        });
      },
      25000,
    );
  }); // Fin tests de incidencias

  describe('Tests-Horarios', () => {
    it_cond(
      'Listar titulaciones',
      async () => {
        const argsListarTitulaciones: Args = RabbitContextArgs.construirArgs(
          JSON.stringify({}),
          null,
          'listar-titulaciones',
        );

        //Esperamos que se inicialicen todos los repositorios
        await sleep(1000);
        const resultadoJSON = await listarDegrees(testapp, new RmqContext(argsListarTitulaciones));

        //Buscamos las titulaciones que hay en la base de datos
        const querybuilder = dataSource.createQueryBuilder(Degree, 'degree');
        const degrees_encontradas = await querybuilder
          .orderBy("degree.codplan","ASC")
          .printSql()
          .getRawMany();
        expect(degrees_encontradas.length).toEqual(resultadoJSON.resultado.length)
        for (let i = 0; i < degrees_encontradas.length; i++) {
          expect(degrees_encontradas[i].degree_nombre).toEqual(resultadoJSON.resultado[i].name)
          expect(degrees_encontradas[i].degree_numcursos).toEqual(resultadoJSON.resultado[i].years.length)
        }
      },
      25000,
    );

    it_cond(
      'Obtener horas disponibles',
      async () => {

        const argsEntradas = {
          body: {
            DegreeSet: actualizarHorarioInput.body.DegreeSet
          },
        };

        const argsObtenerEntradas: Args = RabbitContextArgs.construirArgs(
          JSON.stringify(argsEntradas),
          null,
          'obtener-horas-disponibles',
        );

        //Esperamos que se inicialicen todos los repositorios
        await sleep(1000);
        const resultadoJSON = await obtenerAvailableHours(testapp, new RmqContext(argsObtenerEntradas));
        //Buscamos las horas disponibles en la base de datos
        const querybuilder = dataSource.createQueryBuilder(Subject, 'subject');
        const asignaturas_encontradas = await querybuilder
          .where('subject.plan = :plan AND subject.curso = :curso', { plan: actualizarHorarioInput.body.DegreeSet.Degree, curso: actualizarHorarioInput.body.DegreeSet.Year })
          .printSql()
          .getRawMany();
        expect(asignaturas_encontradas.length*3).toEqual(resultadoJSON.resultado.length)
      },
      25000,
    );

    it_cond(
      'Actualizar horario',
      async () => {
        const argsActualizarHorario: Args = RabbitContextArgs.construirArgs(
          JSON.stringify(actualizarHorarioInput),
          null,
          'actualizar-calendario',
        );

        //Esperamos que se inicialicen todos los repositorios
        await sleep(1000);
        const resultadoJSON = await actualizarScheduler(testapp, new RmqContext(argsActualizarHorario));

        //Buscamos las entradas del horario que acabamos de introducir en la base de datos
        const querybuilder = dataSource.createQueryBuilder(Entry, 'entry');
        const entries_encontradas = await querybuilder
          .where('entry.plan = :plan AND entry.curso = :curso AND entry.grupo = :grupo', { plan: actualizarHorarioInput.body.DegreeSet.Degree, curso: actualizarHorarioInput.body.DegreeSet.Year, grupo: actualizarHorarioInput.body.DegreeSet.Group })
          .printSql()
          .getRawMany();
        expect(entries_encontradas.length).toEqual(actualizarHorarioInput.body.Entry.length)
        for (let i = 0; i < entries_encontradas.length; i++) {
          expect(entries_encontradas[i].entry_plan).toEqual(actualizarHorarioInput.body.DegreeSet.Degree)
          expect(entries_encontradas[i].entry_curso).toEqual(actualizarHorarioInput.body.DegreeSet.Year)
          expect(entries_encontradas[i].entry_grupo).toEqual(actualizarHorarioInput.body.DegreeSet.Group)
          expect(entries_encontradas[i].entry_inicio).toEqual(actualizarHorarioInput.body.Entry[i].Init.hour.toString() + ':' + actualizarHorarioInput.body.Entry[i].Init.min.toString())
          expect(entries_encontradas[i].entry_fin).toEqual(actualizarHorarioInput.body.Entry[i].End.hour.toString() + ':' + actualizarHorarioInput.body.Entry[i].End.min.toString())
          expect(entries_encontradas[i].entry_nombreasignatura).toEqual(actualizarHorarioInput.body.Entry[i].Subject.Name)
          expect(entries_encontradas[i].entry_tipo).toEqual(actualizarHorarioInput.body.Entry[i].Subject.Kind)
          expect(entries_encontradas[i].entry_idaula).toEqual(actualizarHorarioInput.body.Entry[i].Room.Name)
          expect(entries_encontradas[i].entry_semana).toEqual(actualizarHorarioInput.body.Entry[i].Week)
          expect(entries_encontradas[i].entry_dia).toEqual(actualizarHorarioInput.body.Entry[i].Weekday)
        }
      },
      25000,
    );

    it_cond(
      'Obtener entradas',
      async () => {

        const argsEntradas = {
          body: {
            DegreeSet: actualizarHorarioInput.body.DegreeSet
          },
        };

        const argsObtenerEntradas: Args = RabbitContextArgs.construirArgs(
          JSON.stringify(argsEntradas),
          null,
          'obtener-entradas',
        );

        //Esperamos que se inicialicen todos los repositorios
        await sleep(1000);
        const resultadoJSON = await obtenerEntries(testapp, new RmqContext(argsObtenerEntradas));
        //Buscamos las entradas que hemos introducido en la base de datos en el test anterior
        const querybuilder = dataSource.createQueryBuilder(Entry, 'entry');
        const entries_encontradas = await querybuilder
          .where('entry.plan = :plan AND entry.curso = :curso AND entry.grupo = :grupo', { plan: actualizarHorarioInput.body.DegreeSet.Degree, curso: actualizarHorarioInput.body.DegreeSet.Year, grupo: actualizarHorarioInput.body.DegreeSet.Group })
          .printSql()
          .getRawMany();
        expect(entries_encontradas.length).toEqual(resultadoJSON.resultado.length)
        for (let i = 0; i < entries_encontradas.length; i++) {
          expect(entries_encontradas[i].entry_plan).toEqual(resultadoJSON.resultado[i].Degree)
          expect(entries_encontradas[i].entry_curso).toEqual(resultadoJSON.resultado[i].Year)
          expect(entries_encontradas[i].entry_grupo).toEqual(resultadoJSON.resultado[i].Group)
          expect(entries_encontradas[i].entry_inicio).toEqual(resultadoJSON.resultado[i].Init.hour.toString() + ':' + resultadoJSON.resultado[i].Init.min.toString())
          expect(entries_encontradas[i].entry_fin).toEqual(resultadoJSON.resultado[i].End.hour.toString() + ':' + resultadoJSON.resultado[i].End.min.toString())
          expect(entries_encontradas[i].entry_nombreasignatura).toEqual(resultadoJSON.resultado[i].Subject.Name)
          expect(entries_encontradas[i].entry_tipo).toEqual(resultadoJSON.resultado[i].Subject.Kind)
          expect(entries_encontradas[i].entry_idaula).toEqual(resultadoJSON.resultado[i].Room.Name)
          expect(entries_encontradas[i].entry_semana).toEqual(resultadoJSON.resultado[i].Week)
          expect(entries_encontradas[i].entry_dia).toEqual(resultadoJSON.resultado[i].Weekday)
        }

        //Borramos las entradas del horario que hemos introducido en la base de datos en el test anterior
        await querybuilder
          .delete()
          .from(Entry)
          .where('plan = :plan AND curso = :curso AND grupo = :grupo', { plan: actualizarHorarioInput.body.DegreeSet.Degree, curso: actualizarHorarioInput.body.DegreeSet.Year, grupo: actualizarHorarioInput.body.DegreeSet.Group })
          .execute();
      },
      25000,
    );
  }); // Fin tests de horarios
});

function cancelarR(testapp: AMQPController, contextRabbit: RmqContext) {
  return testapp.cancelarReserva(null, contextRabbit);
}

function realizarR(testapp: AMQPController, contextRabbit: RmqContext) {
  return testapp.realizarReservas(null, contextRabbit);
}

function filtrarEsp(testapp: AMQPController, contextRabbit: RmqContext) {
  return testapp.buscarReservaPorEspacio(null, contextRabbit);
}

function obtenerEsp(testapp: AMQPController, contextRabbit: RmqContext) {
  return testapp.obtenerReservasEspacio(null, contextRabbit);
}

function realizarIssue(testapp: AMQPController, contextRabbit: RmqContext) {
  return testapp.crearIncidencia(null, contextRabbit);
}

function modificarIssue(testapp: AMQPController, contextRabbit: RmqContext) {
  return testapp.modificarEstadoIncidencia(null, contextRabbit);
}

function obtenerIssues(testapp: AMQPController, contextRabbit: RmqContext) {
  return testapp.obtenerIncidencias(null, contextRabbit);
}

function listarDegrees(testapp: AMQPController, contextRabbit: RmqContext) {
  return testapp.obtenerTitulaciones(null, contextRabbit);
}

function obtenerAvailableHours(testapp: AMQPController, contextRabbit: RmqContext) {
  return testapp.obtenerHorasDisponibles(null, contextRabbit);
}

function actualizarScheduler(testapp: AMQPController, contextRabbit: RmqContext) {
  return testapp.actualizarHorario(null, contextRabbit);
}

function obtenerEntries(testapp: AMQPController, contextRabbit: RmqContext) {
  return testapp.obtenerEntradas(null, contextRabbit);
}
function cancelarIssue(testapp: AMQPController, contextRabbit: RmqContext){
  return testapp.eliminarIncidencia(null, contextRabbit);
}

function descargarPDF(testapp: AMQPController, contextRabbit: RmqContext) {
  return testapp.descargarPDFIncidencias(null, contextRabbit);
}
