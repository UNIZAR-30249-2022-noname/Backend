import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TestHttpModule } from '../src/Infraestructure/testhttp.module';
import { AMQPController } from '../src/Infraestructure/Adapters/rabbit.controller';
import { ReservaService } from '../src/Mooc/Reserva/Application/reserva.service';
import { MockReservaRepository } from './mockReservaRepository';
import { EspacioService } from '../src/Mooc/Espacio/Application/usecase/espacio.service';
import { IncidenciaService } from '../src/Mooc/Incidencia/Application/usecase/incidencia.service';
import { EspacioRepoPGImpl } from '../src/Mooc/Espacio/Infraestructure/espacio.repository';
import { IncidenciaRepoPGImpl } from '../src/Mooc/Incidencia/Infraestructure/incidencia.repository';
import { ClientProxy, ClientsModule, RmqContext, Transport } from '@nestjs/microservices';
import { Observable } from 'rxjs/internal/Observable';
import { RabbitContextArgs,Args } from './RabbitContextArgs';
import providers from './config';


describe('AppController (e2e)', () => {
  let app: INestApplication;
  let testapp: AMQPController;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestHttpModule],
    }).compile();
    
    app = moduleFixture.createNestApplication();
    await app.init();

    const moduleTest: TestingModule = await Test.createTestingModule({
      controllers: [AMQPController],
      providers: providers
    }).compile();
    testapp = moduleTest.get(AMQPController)
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

  it('Cancelar reserva debería devolver true con una reserva existente.', async () => {

    const argsObject = {
      body: {
        id: 1
      }
    }
    let args: Args = RabbitContextArgs.construirArgs(JSON.stringify(argsObject),null,'cancelar-reserva');
    const contextRabbit = new RmqContext(args);
    const resultadoJSON = await testapp.cancelarReserva(null, contextRabbit)
    expect( resultadoJSON.resultado).toBe(true);
  });
});
