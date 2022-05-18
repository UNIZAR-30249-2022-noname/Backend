import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { TestHttpModule } from './Infraestructure/testhttp.module';

async function bootstrap() {
  const http_app = await NestFactory.create(TestHttpModule);
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
          noAck: true, //If false, manual acknowledgment mode enabled
        },
      },
    },
  );
  http_app.listen('3400').then(() => console.log('Http Test Controller on.'));
  app
    .listen()
    .then(() => console.log('Servicio rabbit funcionando en puerto.'));
}

bootstrap();
