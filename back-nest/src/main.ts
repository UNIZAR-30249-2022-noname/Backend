import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { INestMicroservice } from '@nestjs/common';

async function bootstrap() {
  const queues: string[] = ['request'];

  queues.forEach(async (cola) => {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
      AppModule,
      {
        transport: Transport.RMQ,
        options: {
          urls: [
            'amqps://cnvzbkyj:zrT84snzxNyFwAZl1MV2vI9Gg8OtjiRV@whale.rmq.cloudamqp.com/cnvzbkyj',
          ],
          queue: cola,
          queueOptions: {
            durable: false, //garantiza persistencia de mensajes cuando se apaga la cola
            noAck: true,    //ack automático o no.
          },
        },
      },
    );
    app.listen().then(() => console.log('Servicio rabbit funcionando.'));
  });
}

bootstrap();
