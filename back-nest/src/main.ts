import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';


/*async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();*/
async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqps://draayoqu:7lDJ4nHZhhKGUn2lQCvw8XE4VNuVxMvD@rat.rmq2.cloudamqp.com/draayoqu'],
      queue: 'reservas_queue',
      queueOptions: {
        durable: true, //garantiza persistencia de mensajes cuando se apaga la cola
        noAck: true
      },
    },
  });

  app.listen().then( () => console.log("Servicio rabbit funcionando."));
}

bootstrap();
