import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { INestMicroservice } from '@nestjs/common';


async function bootstrap() {

  const queues:string[] = ['reservas_queue']

  queues.forEach( async (cola) => {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.RMQ,
      options: {
        urls: ['amqps://draayoqu:7lDJ4nHZhhKGUn2lQCvw8XE4VNuVxMvD@rat.rmq2.cloudamqp.com/draayoqu'],
        queue: cola,
        queueOptions: {
          durable: true, //garantiza persistencia de mensajes cuando se apaga la cola
          noAck: true
        },
      },
    });
    app.listen().then( () => console.log("Servicio rabbit funcionando."));
  })
  
}

bootstrap();
