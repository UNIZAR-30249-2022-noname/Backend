import {
  ClientProxy,
  MessagePattern,
  RmqContext,
  Payload,
  Ctx,
} from '@nestjs/microservices';

export interface MessagePort {
  recibirPeticionesReserva(
    data: number[],
    context: RmqContext,
  ): any

  realizarReservas(
    data: number[],
    context: RmqContext,
  ): any
}
