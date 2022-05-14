import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, INestMicroservice } from '@nestjs/common';
import request from 'supertest';
import { TestHttpModule } from '../src/Infraestructure/testhttp.module';
import { AMQPController } from '../src/Infraestructure/Adapters/rabbit.controller';
import { RmqContext} from '@nestjs/microservices';
import { RabbitContextArgs,Args } from './RabbitContextArgs';
import providers from './config';
import dataSource from '../src/Config/ormconfig';
import { Reserve } from '../src/Mooc/Reserva/Domain/Entities/reserva.entity';


function sleep(milliseconds:number) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

const jestConsole = console;

describe('AMQPController (e2e)', () => {
  let app: INestApplication;
  var testapp: AMQPController;

  beforeAll( async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [TestHttpModule]
    }).compile();
    
    app = moduleFixture.createNestApplication();
    await app.init();
    //Controlador Rabbit
    const moduleTest: TestingModule =  await Test.createTestingModule({
      controllers: [AMQPController],
      providers: providers
    }).compile();
    
    testapp = moduleTest.get(AMQPController);
    global.console = require('console');
    if (!dataSource.isInitialized) await dataSource.initialize()

  });

  afterAll( async () => {
    global.console = jestConsole;
    await dataSource.destroy();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/test/prueba')
      .expect(200)
      .expect('Hello World');
  });


  it('AmqpController should be defined', () => {
    expect(testapp).toBeDefined();
  });

  describe('Test-Reservas', () => {

    it('Crear una reserva debería devolver el id de la reserva que se ha creado.', async () => {
      //Argumentos a mandar para cancelar la reserva
      const argsReserva = {
        body: {
          day: '02-05-1915',
          owner: 'Me',
          event: 'Reserva aula',
          space: 'CRE.1065.00.640',
          scheduled: [ {hour: 10, min: 60}]
        }
      }

      let args: Args = RabbitContextArgs.construirArgs(JSON.stringify(argsReserva),null,'cancelar-reserva');
      //Esperamos que se inicialicen todos los repositorios
      await sleep(3000)
      const resultadoJSON = await realizarR(testapp, new RmqContext(args))
      const querybuilder = dataSource
      .createQueryBuilder(Reserve,'reserve')
      //Buscamos que el id devuelvo para la nueva reserva creada exista y lo devolvemos.
      const idEncontrado = await 
      querybuilder.select('id', 'idreserva')
      .where("reserve.id = :id", { id: resultadoJSON.resultado })
      .printSql() 
      .getRawOne();
      //Comprobamos que coincide el id de la reserva realizada con el id encontrado, es decir se ha hecho la reserva.
      expect(idEncontrado.idreserva).toBe(resultadoJSON.resultado);
      //Borramos la reserva de la base de datos para no dejar rastro.
      querybuilder.delete().from(Reserve)
      .where("id = :id", { id: resultadoJSON.resultado })
      .execute();
      
     },20000)

    it('Cancelar reserva debería devolver false con una reserva no existente.', async () => {
     //Argumentos a mandar para cancelar la reserva
     const argsObject = {
       body: {
         id: -5
       }
     }
     let args: Args = RabbitContextArgs.construirArgs(JSON.stringify(argsObject),null,'cancelar-reserva');
     //Esperamos que se inicialicen todos los repositorios
     await sleep(3000)
     const resultadoJSON = await cancelarR(testapp, new RmqContext(args))
     expect( resultadoJSON.resultado).toBe(false);
    },20000)

    it('Cancelar reserva debería devolver true con una reserva existente.', async () => {
      const argsReserva = {
        body: {
          day: '13-05-1915',
          owner: 'Me',
          event: 'Reserva aula',
          space: 'CRE.1065.00.640',
          scheduled: [ {hour: 8, min: 60}]
        }
      }

      let argsCrearReserva : Args = RabbitContextArgs.construirArgs(JSON.stringify(argsReserva),null,'realizar-reserva');
      //Esperamos que se inicialicen todos los repositorios
      await sleep(3000)
      const resultadoreserva = await realizarR(testapp,new RmqContext(argsCrearReserva))
      //Argumentos a mandar para cancelar la reserva
      const argsObject = {
        body: {
          id: resultadoreserva.resultado
        }
      }
      let args: Args = RabbitContextArgs.construirArgs(JSON.stringify(argsObject),null,'cancelar-reserva');
      const resultadoJSON = await cancelarR(testapp, new RmqContext(args))
      expect( resultadoJSON.resultado).toBe(true);
    },25000)
  })

  describe('Tests-Espacios', () => {

    it('Filtrar los espacios del Ada Byron con capacidad 0 de todas las plantas debería devolver 316 espacios.', async () => {
      const argsFiltrado= {
        body: {
          capacity: '0',
          building: 'Ada Byron',
          floor: '',
          day: '',
          hour: {hour: 0, min: 0}
        }
      }

      let argsFiltrarReserva : Args = RabbitContextArgs.construirArgs(JSON.stringify(argsFiltrado),null,'filtrar-espacios');
      //Esperamos que se inicialicen todos los repositorios
      await sleep(3000)
      const resultadofiltrado = await filtrarEsp(testapp,new RmqContext(argsFiltrarReserva))
      expect( resultadofiltrado.resultado.length).toEqual(316)
    },25000)

    it('Filtrar los espacios del Ada Byron con capacidad mayor que 1, no debería devolver el espacio reservado.', async () => {
  
      const argsFiltrado= {
        body: {
          capacity: '1',
          building: 'Ada Byron',
          floor: 'Primera',
          day: '13-05-1920',
          hour: {hour: 17, min: 60}
        }
      }

      const argsReserva = {
        body: {
          day: '13-05-1920',
          owner: 'Me',
          event: 'Reservar aula',
          space: 'CRE.1200.01.030', //Aula A.11
          scheduled: [ {hour: 17, min: 60}]
        }
      }
      let argsCrearReserva : Args = RabbitContextArgs.construirArgs(JSON.stringify(argsReserva),null,'realizar-reserva');
      let argsFiltrarReserva : Args = RabbitContextArgs.construirArgs(JSON.stringify(argsFiltrado),null,'filtrar-espacios');
      //Esperamos que se inicialicen todos los repositorios
      await sleep(3000)
      const resultadoreserva = await realizarR(testapp,new RmqContext(argsCrearReserva))
      const resultadofiltrado = await filtrarEsp(testapp,new RmqContext(argsFiltrarReserva))
      //Comprobamos que el ID del espacio reservado no es devuelto a la hora de filtrar.
      resultadofiltrado.resultado.map( espacio => { expect(espacio.id).not.toEqual(argsReserva.body.space)})
      //Borramos la reserva.
      const querybuilder = 
      dataSource.createQueryBuilder(Reserve,'reserve');
          querybuilder
          .delete()
          .from(Reserve)
          .where("id = :id", { id: resultadoreserva.resultado })
          .execute();
    },25000)

  })

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


