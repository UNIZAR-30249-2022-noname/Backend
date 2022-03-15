var amqp = require('amqplib/callback_api');
const queue_name = 'rpc_queue';
import client, {Channel,Connection,ConsumeMessage} from 'amqplib'
import {RabbitMQConfig} from '../../Configuration/RabbitMQConfig'


class RabbitMQAdapter{

  private mqConfig: RabbitMQConfig

  constructor(RabbitConfig: RabbitMQConfig) {
    this.mqConfig = RabbitConfig
  }

  public async receiveRabbitMessage(){
      
      const channel = await this.mqConfig.createRPCQueue()

      channel.prefetch(1);
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
}


export function procesarSolicitud(mensajeRecibido: any) {
  return "Solicitud procesada: " +  mensajeRecibido;
}
//Simulación de cómo ejecutarlo
let rma: RabbitMQAdapter = new RabbitMQAdapter(new RabbitMQConfig(queue_name,null))
rma.receiveRabbitMessage(); 