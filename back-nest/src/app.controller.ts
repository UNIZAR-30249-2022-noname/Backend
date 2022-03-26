import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {DatosReserva, DatosReservaProps} from './Mooc/Reserva/Domain/Entities/datosreserva'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get("/fecha")
  getAdios(): string {
    const datosprops: DatosReservaProps = {
      fecha: new Date(),
      horaInicio: "10:00",
      horaFin: "12:00",
    }
    const fecha: string = DatosReserva.createDatosReserva(datosprops).getasString();
    return fecha;
  }
}
