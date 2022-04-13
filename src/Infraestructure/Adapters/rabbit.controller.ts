import {
  servicioReservaI,
  ReservaService,
} from '../../Mooc/Reserva/Application/reserva.service';
import { DatosReservaProps } from '../../Mooc/Reserva/Domain/Entities/datosreserva';
import { Espacio} from '../../Mooc/Espacio/Domain/Entities/espacio';
import { DomainId, ShortDomainId } from 'types-ddd';
import * as crypto from 'crypto';
import { Controller, Inject } from '@nestjs/common';
import {
  ClientProxy,
  MessagePattern,
  RmqContext,
  Payload,
  Ctx,
} from '@nestjs/microservices';
import {Reserve}  from 'src/Mooc/Reserva/Domain/Entities/reserva.entity';
import { servicioEspacioI } from 'src/Mooc/Espacio/Application/usecase/espacio.service';
import { servicioIncidenciaI } from 'src/Mooc/Incidencia/Application/usecase/incidencia.service';
import { Incidencia, IncidenciaProps } from 'src/Mooc/Incidencia/Domain/Entities/incidencia';

@Controller()
export class AMQPController{
  
  //Constructor inyeccion de dependencias de todos los servicios de aplicación que sean necesarios.
  constructor(
    @Inject('servicioReservaI') private readonly servicioReservas: servicioReservaI,
    @Inject('servicioEspacioI') private readonly servicioEspacios: servicioEspacioI,
    @Inject('servicioIncidenciaI') private readonly servicioIncidencias: servicioIncidenciaI
  ) {}
  
  /*******************************/
  /***********RESERVAS************/
  /*******************************/

  //Endpoint para recibir una realización de una reserva
  @MessagePattern('realizar-reserva')
  async realizarReservas(
    @Payload() data: number[],
    @Ctx() context: RmqContext,
  ) {
    
    //Convierte el mensaje en un Objeton JSON.
    const mensajeRecibido = JSON.parse(context.getMessage().content);
    console.log('Procesando Solicitud(realizar-reserva)', mensajeRecibido);
    const horainicio: number = mensajeRecibido.body.scheduled[0].hour
    const horafin:number = mensajeRecibido.body.scheduled[1].hour
    console.log(horainicio) 
    const evento: string = mensajeRecibido.body.event
    const reservaprops: DatosReservaProps = {
      fecha: mensajeRecibido.body.day,
      horaInicio: horainicio,
      horaFin: horafin,
      Persona: mensajeRecibido.body.owner,
    };
    const idEspacio: string = mensajeRecibido.body.space;
    //Devuelve lo que tenga que devolver en formato JSON.
    let resultadoOperacion: Reserve = await this.servicioReservas.guardarReserva(reservaprops,idEspacio);
    console.log(resultadoOperacion)
    return {id: resultadoOperacion.id, CorrelationId: mensajeRecibido.id };
  }

  @MessagePattern('buscar-reserva-por-id')
  async buscarReservaPorId(
    @Payload() data: number[],
    @Ctx() context: RmqContext,
  ) {
    const mensajeRecibido = JSON.parse(context.getMessage().content);
    //this.servicioEspacios.filtrarEspacios()
    return true;
  }

  // AQUÍ EMPIEZA EL CONTROLLER DE INCIDENCIAS
  @MessagePattern('filtrar-espacios')
  async buscarReservaPorEspacio(
    @Payload() data: number[],
    @Ctx() context: RmqContext,
  ) {
   
  }


  @MessagePattern('importar-espacios')
  async importarEspacios(
    @Payload() data: number[],
    @Ctx() context: RmqContext,
  ) {
    // TODO: FALTA CONVERTIR EL BINARIO DE RABBIT A CSV Y PASARSELO A importarEspacios. ACTUALMENTE COGE AUTOMÁTICAMENTE EL TB_ESPACIOS.csv
    const resultadoOperacionInsertar = await this.servicioEspacios.importarEspacios();
    return resultadoOperacionInsertar;
  }

  /*******************************/
  /***********INCIDENCIAS*********/
  /*******************************/
  @MessagePattern('crear-incidencia')
  async crearIncidencia(
    @Payload() data: number[],
    @Ctx() context: RmqContext,
  ) {
    const mensajeRecibido = JSON.parse(context.getMessage().content);
    console.log('Procesando Solicitud(crear-incidencia)', mensajeRecibido);
    const incidenciaprops: IncidenciaProps = {
      Title: mensajeRecibido.body.title,
      Description: mensajeRecibido.body.description,
      State: mensajeRecibido.body.state,
      Tags: mensajeRecibido.body.tags,
      IdSpace: mensajeRecibido.body.slot
    };

    let resultadoOperacion: number = await this.servicioIncidencias.crearIncidencia(incidenciaprops);
    console.log(resultadoOperacion);

    return resultadoOperacion;
  }

  @MessagePattern('modificar-estado-incidencia')
  async modificarEstadoIncidencia(
    @Payload() data: number[],
    @Ctx() context: RmqContext,
  ) {
    const mensajeRecibido = JSON.parse(context.getMessage().content);
    console.log('Procesando Solicitud(modificar-estado-incidencia)', mensajeRecibido);

    let resultadoOperacion: number = await this.servicioIncidencias.modificarEstadoIncidencia(mensajeRecibido.body.key, mensajeRecibido.body.state);
    console.log(resultadoOperacion);

    return resultadoOperacion;
  }

  @MessagePattern('eliminar-incidencia')
  async eliminarIncidencia(
    @Payload() data: number[],
    @Ctx() context: RmqContext,
  ) {
    const mensajeRecibido = JSON.parse(context.getMessage().content);
    console.log('Procesando Solicitud(eliminar-incidencia)', mensajeRecibido);

    let resultadoOperacion: number = await this.servicioIncidencias.eliminarIncidencia(mensajeRecibido.body.key)
    console.log(resultadoOperacion);

    return resultadoOperacion;
  }

  @MessagePattern('obtener-incidencias')
  async obtenerIncidencias(
    @Payload() data: number[],
    @Ctx() context: RmqContext,
  ) {
    console.log('Procesando Solicitud(obtener-incidencias)');

    let resultadoOperacion: Incidencia[] = await this.servicioIncidencias.obtenerTodasIncidencias();
    console.log(resultadoOperacion);

    return resultadoOperacion;
  }

  /***************************************/
  /***********EDIFICIOS Y PLANTAS*********/
  /***************************************/
  @MessagePattern('obtener-edificios')
  async obtenerEdificios(
    @Payload() data: number[],
    @Ctx() context: RmqContext,
  ) {
    console.log('Procesando Solicitud(obtener-edificios)');

    const Edificios = [
      {
        nombre: "Ada Byron",
        plantas: ["Sótano", "Baja", "Primera", "Segunda", "Tercera", "Cuarta", "Quinta"]
      },
      {
        nombre: "Torres Quevedo",
        plantas: ["Sótano", "Baja", "Primera", "Segunda", "Tercera"]
      },
      {
        nombre: "Betancourt",
        plantas: ["Sótano", "Baja", "Primera", "Segunda", "Tercera"]
      }
    ]
    
    return Edificios;
  }
}
