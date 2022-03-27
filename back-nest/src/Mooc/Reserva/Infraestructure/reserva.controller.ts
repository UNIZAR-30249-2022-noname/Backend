import {RabbitMQAdapter} from '../../../Infraestructure/Adapters/RabbitMQAdapter'
import client, {Channel,Connection,ConsumeMessage} from 'amqplib'
import { RabbitMQConfig } from '../../../Configuration/RabbitMQConfig';
import {servicioReservaI, ReservaService} from '../Application/reserva.service'
import {ReservaRepoPGImpl} from './ReservaRepoImpl'
import {DatosReservaProps} from '../Domain/Entities/datosreserva'
import {Espacio, EspacioProps} from '../../Espacio/Domain/Entities/espacio'
import { DomainId, ShortDomainId } from 'types-ddd';

import * as crypto from "crypto";
import { Controller, Inject } from '@nestjs/common';
import {ClientProxy, MessagePattern, RmqContext, Payload, Ctx, EventPattern} from '@nestjs/microservices';

@Controller()
export class ReservasMQAdapter {
    
    private GUARDAR_RESERVAS:string = 'guardar_reservas';
    private ACTUALIZAR_RESERVAS:string = 'actualizar_reservas';

    constructor(@Inject('servicioReservaI') private readonly servicioReservas: servicioReservaI){}
          //    @Inject('RESERVAS_SERVICE') private readonly client: ClientProxy){ }

    @MessagePattern()
    async recibirPeticionesReserva(@Payload() data: number[], @Ctx() context: RmqContext){
      //Analizamos el tipo de mensaje recibido y en función de este llamamos a un servicio u a otro.
      const messageID:string = context.getArgs()[0].properties.messageId;
      switch (messageID) {
        case this.GUARDAR_RESERVAS:
            let mensajeRecibido: String = context.getMessage().content.toString();
            console.log(" [.] Procesando Solicitud(%s)", mensajeRecibido);
            const reservaprops: DatosReservaProps = {
              Fecha: new Date().toISOString(),
              HoraInicio: '10:00',
              HoraFin: '12:00',
              Persona: 'Sergio'
            }
            let id: ShortDomainId = ShortDomainId.create(crypto.randomBytes(64).toString('hex'))
            const espacioprops: EspacioProps = {
              ID: id, 
              Name: "hola", 
              Capacity: 15, 
              Building: "Ada", 
              Kind: "Sanidad"
            }
            let resultadoOperacion = await this.servicioReservas.guardarReserva(reservaprops,espacioprops)
            console.log(resultadoOperacion)
          break;
      
        default:
          console.log("Petición de reservas no procesada.")
          //devolver un mensaje de error a la cola de rabbit
          break;
      }
    }
}

/**
 * Ejecución main
 *
const req_queue_name = 'rpc_queue';
const rep_queue_name = 'rpc_queue';
const servicioReservas: servicioReservaImpl = new servicioReservaImpl(new ReservaRepoPGImpl());
const reservasAdapter: ReservasMQAdapter = new ReservasMQAdapter(new RabbitMQConfig(req_queue_name,rep_queue_name,null),servicioReservas);
reservasAdapter.RPCconsumeMessage()
*/