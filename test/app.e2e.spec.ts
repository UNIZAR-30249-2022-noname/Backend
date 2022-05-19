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
import { expectedOuputT3 } from './test-data/data';
import { it_cond } from './config';
import { Issue } from '../src/Mooc/Incidencia/Domain/Entities/incidencia.entity';

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
        await sleep(3000);
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
        await sleep(3000);
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
        await sleep(3000);
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
        querybuilder
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
        querybuilder
          .delete()
          .from(Issue)
          .where('id = :id', { id: resultadoJSON.resultado })
          .execute();
      },
      25000,
    );

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
        //El estado debería ser 2 para esa incidencia
        expect(issue_encontrada.issue_estado).toBe(1)
        //Borramos la incidencia de la base de datos.
        querybuilder
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
          space: 'CRE.1200.00.040',
        });
      },
      25000,
    );
  }); // Fin tests de incidencias
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
