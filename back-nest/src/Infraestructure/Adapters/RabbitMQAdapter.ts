var amqp = require('amqplib/callback_api');
import client, { Channel, Connection, ConsumeMessage } from 'amqplib';
import { RabbitMQConfig } from '../../Configuration/RabbitMQConfig';
import { AMQP } from './AMQPPort';

export abstract class RabbitMQAdapter implements AMQP {
  protected mqConfig: RabbitMQConfig;

  constructor(RabbitConfig: RabbitMQConfig) {
    this.mqConfig = RabbitConfig;
  }
  RPCconsumeMessage(): void {}
  RPCpublishMessage(
    queue: string,
    channel: client.Channel,
    message: any,
  ): void {}
}

//Simulación de cómo ejecutarlo
//let rma: RabbitMQAdapter = new RabbitMQAdapter(new RabbitMQConfig(queue_name,null))
//rma.receiveRabbitMessage();

/**
 *   public async receiveRabbitMessage(){
      
      const channel = await this.mqConfig.createRPCQueue()

      console.log(' [x] Awaiting RPC requests');
      channel.consume(queue_name, (msg: ConsumeMessage | null) => {
          if(msg){
            let mensajeRecibido: String = msg.content.toString();
            console.log(" [.] procesarSolicitud(%s)", mensajeRecibido);
            var r = procesarSolicitud(mensajeRecibido);

            channel.sendToQueue(msg.properties.replyTo,
              Buffer.from(r.toString()), {
                correlationId: msg.properties.correlationId
              });

            channel.ack(msg);
          }
        });
      
    }
 * 
 */
