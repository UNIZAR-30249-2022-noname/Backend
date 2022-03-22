import {RabbitMQAdapter} from '../../../Infraestructure/Adapters/RabbitMQAdapter'
import client, {Channel,Connection,ConsumeMessage} from 'amqplib'
import { RabbitMQConfig } from '../../../Configuration/RabbitMQConfig';
import {servicioReserva,servicioReservaImpl} from '../Application/usecase/guardarReservaUseCase'
import {ReservaRepoPGImpl} from './ReservaRepoImpl'
import { Client } from 'pg';

class ReservasMQAdapter extends RabbitMQAdapter {
    

    constructor(RabbitConfig: RabbitMQConfig,
        private readonly servicioReservas: servicioReserva
        ){
        super(RabbitConfig);
    }

    private async setupChannelAdapter(): Promise<client.Channel> {
        return await this.mqConfig.createRPCQueue()
    }

    async RPCconsumeMessage(): Promise<void> {

        console.log(' [x] Awaiting RPC requests');
        const channel: client.Channel = await this.setupChannelAdapter();
        channel.consume(this.mqConfig.RequestQueueName, (msg: ConsumeMessage | null) => {
            if(msg){
              let mensajeRecibido: String = msg.content.toString();
              console.log(" [.] procesarSolicitud(%s)", mensajeRecibido);
              //let resultadoOperacion = await this.servicioReservas.guardarReserva()
              channel.sendToQueue(msg.properties.replyTo,
                Buffer.from(mensajeRecibido.toString()), {
                  correlationId: '1234',
                });
               channel.ack(msg)
            }
          });
        
    }
    
    RPCpublishMessage(queue: string, channel: client.Channel, message: any): void {
        
    }

}

/**
 * Ejecución main
 */
const req_queue_name = 'rpc_queue';
const rep_queue_name = 'rpc_queue';
const servicioReservas: servicioReservaImpl = new servicioReservaImpl(new ReservaRepoPGImpl());
const reservasAdapter: ReservasMQAdapter = new ReservasMQAdapter(new RabbitMQConfig(req_queue_name,rep_queue_name,null),servicioReservas);
reservasAdapter.RPCconsumeMessage()