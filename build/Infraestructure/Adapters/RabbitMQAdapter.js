"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitMQAdapter = void 0;
var amqp = require('amqplib/callback_api');
class RabbitMQAdapter {
    constructor(RabbitConfig) {
        this.mqConfig = RabbitConfig;
    }
    RPCconsumeMessage() { }
    RPCpublishMessage(queue, channel, message) { }
}
exports.RabbitMQAdapter = RabbitMQAdapter;
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
