import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { INestMicroservice } from '@nestjs/common';
import { DataSource } from 'typeorm';
import dataSource from './Config/ormconfig_db';

async function bootstrap() {

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
        transport: Transport.RMQ,
        options: {
          urls: [
            'amqps://cnvzbkyj:zrT84snzxNyFwAZl1MV2vI9Gg8OtjiRV@whale.rmq.cloudamqp.com/cnvzbkyj',
          ],
          queue: 'request',
          replyQueue: 'reply',
          noAck: true,
          queueOptions: {
            durable: false, //garantiza persistencia de mensajes cuando se apaga la cola
            noAck: true,    //If false, manual acknowledgment mode enabled
          },
      },
    },
  );
  app.listen().then(() => console.log('Servicio rabbit funcionando.'));
}

bootstrap();