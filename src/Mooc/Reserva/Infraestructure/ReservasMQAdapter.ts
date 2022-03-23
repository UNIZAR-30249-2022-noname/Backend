import {RabbitMQAdapter} from '../../../Infraestructure/Adapters/RabbitMQAdapter'
import client, {Channel,Connection,ConsumeMessage} from 'amqplib'
import { RabbitMQConfig } from '../../../Configuration/RabbitMQConfig';
import {servicioReserva,servicioReservaImpl} from '../Application/usecase/guardarReservaUseCase'
import {ReservaRepoPGImpl} from './ReservaRepoImpl'
import {DatosReservaProps} from '../Domain/Entities/datosreserva'
import {Espacio} from '../../Espacio/Domain/espacio'
import { DomainId, ShortDomainId } from 'types-ddd';

import * as crypto from "crypto";


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
        channel.consume(this.mqConfig.RequestQueueName, async (msg: ConsumeMessage | null) => {
            if(msg){
              let mensajeRecibido: String = msg.content.toString();
              console.log(" [.] procesarSolicitud(%s)", mensajeRecibido);
              const reservaprops: DatosReservaProps = {
                fecha: new Date(),
                horaInicio: '10:00',
                horaFin: '12:00'
              }
              let id: ShortDomainId = ShortDomainId.create(crypto.randomBytes(64).toString('hex'))
              const espacio: Espacio = new Espacio({ID: id, Name: "hola", Capacity: 15, Building: "Ada", Kind: "Sanidad"})
              let resultadoOperacion = await this.servicioReservas.guardarReserva(reservaprops,espacio)
              console.log(resultadoOperacion)
              channel.sendToQueue(msg.properties.replyTo,
                Buffer.from(msg.toString()), {
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