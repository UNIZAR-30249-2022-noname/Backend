import {
  servicioReservaI,
  ReservaService,
} from '../../Mooc/Reserva/Application/reserva.service';
import { DatosReservaProps } from '../../Mooc/Reserva/Domain/Entities/datosreserva';
import {
  Espacio,
  EspacioProps,
} from '../../Mooc/Espacio/Domain/Entities/espacio';
import * as crypto from 'crypto';
import { Controller, Inject } from '@nestjs/common';
import {
  ClientProxy,
  MessagePattern,
  RmqContext,
  Payload,
  Ctx,
} from '@nestjs/microservices';
import { Reserve } from '../../Mooc/Reserva/Domain/Entities/reserva.entity';
import { servicioEspacioI } from '../../Mooc/Espacio/Application/usecase/espacio.service';
import { servicioIncidenciaI } from '../../Mooc/Incidencia/Application/usecase/incidencia.service';
import { Incidencia, IncidenciaProps } from '../../Mooc/Incidencia/Domain/Entities/incidencia';
import { servicioHorarioI } from 'src/Mooc/Horario/Application/usecase/horario.service';
import { Entrada, EntradaProps } from 'src/Mooc/Horario/Domain/Entities/entrada';

@Controller()
export class AMQPController {

  //Constructor inyeccion de dependencias de todos los servicios de aplicación que sean necesarios.
  constructor(
    @Inject('servicioReservaI') private readonly servicioReservas: servicioReservaI,
    @Inject('servicioEspacioI') private readonly servicioEspacios: servicioEspacioI,
    @Inject('servicioIncidenciaI') private readonly servicioIncidencias: servicioIncidenciaI,
    @Inject('servicioHorarioI') private readonly servicioHorarios: servicioHorarioI,
  ) { }

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
    const horainicio: number = mensajeRecibido.body.scheduled[0].hour;
    const horafin: number = mensajeRecibido.body.scheduled[0].hour + 1;
    //Instanciamos reservasprops.
    const reservaprops: DatosReservaProps = {
      fecha: mensajeRecibido.body.day,
      horaInicio: horainicio,
      horaFin: horafin,
      Persona: mensajeRecibido.body.owner,
      evento: mensajeRecibido.body.event,
    };
    console.log(reservaprops);
    const idEspacio: string = mensajeRecibido.body.space;
    //Devuelve lo que tenga que devolver en formato JSON.
    const resultadoOperacion: Reserve =
      await this.servicioReservas.guardarReserva(reservaprops, idEspacio);
    const idReserva: number =
      resultadoOperacion != null ? resultadoOperacion.id : -1;
    return { resultado: idReserva, CorrelationId: mensajeRecibido.id };
  }

  @MessagePattern('cancelar-reserva')
  async cancelarReserva(@Payload() data: number[], @Ctx() context: RmqContext) {
    const mensajeRecibido = JSON.parse(context.getMessage().content);
    const idReserva: string = mensajeRecibido.body.id;
    const resultadoOperacion = await this.servicioReservas.eliminarReserva(
      idReserva,
    );
    return { resultado: resultadoOperacion, CorrelationId: mensajeRecibido.id };
  }
  /**
   *
   * @param context
   * {
   *  Name string `json:"id"`
   *  Date string `json:"date"`
   * }
   * @param data
   * @returns
   * 	Array =>
   *  (
   *    hora      int
   *    busy      bool
   *    person    string
   *  ) para cada reserva
   */
  @MessagePattern('obtener-informacion-espacio')
  async obtenerReservasEspacio(
    @Payload() data: number[],
    @Ctx() context: RmqContext,) {
    const mensajeRecibido = JSON.parse(context.getMessage().content);
    const idEspacio: string = mensajeRecibido.body.id;
    const fecha: string = mensajeRecibido.body.date;
    let InfoSlots = await this.servicioReservas.obtenerReservasEspacio(idEspacio, fecha);
    let SlotData = await this.servicioEspacios.buscarEspacioPorId(idEspacio);
    return { resultado: { InfoSlots, SlotData }, CorrelationId: mensajeRecibido.id };
  }

  /*
  -----Recibimos del gateway------
  Capacity int    `json:"capacity"`
  Day      string `json:"day"`
  Hour     Hour   `json:"hour"`
  Floor    string `json:"floor"`
  Building string `json:"building"`
  */
  @MessagePattern('filtrar-espacios')
  async buscarReservaPorEspacio(
    @Payload() data: number[],
    @Ctx() context: RmqContext,
  ) {
    const mensajeRecibido = JSON.parse(context.getMessage().content);
    console.log(mensajeRecibido);
    const espacioprops: EspacioProps = {
      Name: '',
      Capacity:
        mensajeRecibido.body.capacity === ''
          ? null
          : mensajeRecibido.body.capacity,
      Building:
        mensajeRecibido.body.building === ''
          ? null
          : mensajeRecibido.body.building,
      Floor:
        mensajeRecibido.body.floor === '' ? null : mensajeRecibido.body.floor,
      Kind: '',
    };
    //Extraemos parámetros
    const fecha: string | null = mensajeRecibido.body.day === '' ? null : mensajeRecibido.body.day;
    const hour: number | null = mensajeRecibido.body.hour.hour === 0 ? null : mensajeRecibido.body.hour.hour;
    const resultado = await this.servicioEspacios.filtrarEspacios(espacioprops, fecha, hour)
    console.warn(resultado.length)
    return { resultado: resultado, CorrelationId: mensajeRecibido.id }
  }

  @MessagePattern('importar-espacios')
  async importarEspacios(
    @Payload() data: number[],
    @Ctx() context: RmqContext,
  ) {
    const mensajeRecibido = JSON.parse(context.getMessage().content);
    console.log('Procesando Solicitud(importar-espacios)', mensajeRecibido);
    const resultado = await this.servicioEspacios.importarEspacios(mensajeRecibido.body);
    return { resultado: resultado };
  }

  /*******************************/
  /***********INCIDENCIAS*********/
  /*******************************/
  @MessagePattern('crear-incidencia')
  async crearIncidencia(@Payload() data: number[], @Ctx() context: RmqContext) {
    const mensajeRecibido = JSON.parse(context.getMessage().content);
    console.log('Procesando Solicitud(crear-incidencia)', mensajeRecibido);
    const incidenciaprops: IncidenciaProps = {
      Title: mensajeRecibido.body.title,
      Description: mensajeRecibido.body.description,
      State: mensajeRecibido.body.state,
      Tags: mensajeRecibido.body.tags,
      IdSpace: mensajeRecibido.body.space,
      //IdSpace: "CRE.1200.00.040"
    };

    let resultado: number = await this.servicioIncidencias.crearIncidencia(incidenciaprops);
    console.log(resultado);

    console.log({ resultado: resultado, CorrelationId: mensajeRecibido.id })

    return { resultado: resultado, CorrelationId: mensajeRecibido.id };
  }

  @MessagePattern('modificar-estado-incidencia')
  async modificarEstadoIncidencia(
    @Payload() data: number[],
    @Ctx() context: RmqContext,
  ) {
    const mensajeRecibido = JSON.parse(context.getMessage().content);
    console.log(
      'Procesando Solicitud(modificar-estado-incidencia)',
      mensajeRecibido,
    );

    let resultado: number = await this.servicioIncidencias.modificarEstadoIncidencia(mensajeRecibido.body.key, mensajeRecibido.body.state);
    console.log(resultado);
    return { resultado: resultado, CorrelationId: mensajeRecibido.id };
  }

  @MessagePattern('eliminar-incidencia')
  async eliminarIncidencia(
    @Payload() data: number[],
    @Ctx() context: RmqContext,
  ) {
    const mensajeRecibido = JSON.parse(context.getMessage().content);
    console.log('Procesando Solicitud(eliminar-incidencia)', mensajeRecibido);

    let resultado: number = await this.servicioIncidencias.eliminarIncidencia(mensajeRecibido.body.key)
    console.log(resultado);

    return { resultado: resultado, CorrelationId: mensajeRecibido.id };
  }

  @MessagePattern('obtener-incidencias')
  async obtenerIncidencias(
    @Payload() data: number[],
    @Ctx() context: RmqContext,
  ) {
    console.log('Procesando Solicitud(obtener-incidencias)');

    const mensajeRecibido = JSON.parse(context.getMessage().content);
    let resultado: Incidencia[] = await this.servicioIncidencias.obtenerTodasIncidencias();
    console.log(resultado);

    return { resultado: resultado, CorrelationId: mensajeRecibido.id };
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
    const mensajeRecibido = JSON.parse(context.getMessage().content);

    const Edificios = [
      {
        nombre: 'Ada Byron',
        plantas: [
          'Sótano',
          'Baja',
          'Primera',
          'Segunda',
          'Tercera',
          'Cuarta',
          'Quinta',
        ],
      },
      {
        nombre: 'Torres Quevedo',
        plantas: ['Sótano', 'Baja', 'Primera', 'Segunda', 'Tercera'],
      },
      {
        nombre: "Betancourt",
        plantas: ["Sótano", "Baja", "Primera", "Segunda", "Tercera"]
      }
    ]

    return { resultado: Edificios, CorrelationId: mensajeRecibido.id };
  }

  /*******************************/
  /***********HORARIOS*********/
  /*******************************/
  @MessagePattern('importar-cursos')
  async importarCursos(
    @Payload() data: number[],
    @Ctx() context: RmqContext,
  ) {
    // TODO: FALTA CONVERTIR EL BINARIO DE RABBIT A CSV Y PASARSELO A importarCursos. ACTUALMENTE COGE AUTOMÁTICAMENTE EL Listado_207.xlsx
    const resultado = await this.servicioHorarios.importarCursos();
    return { resultado: resultado };
  }

  @MessagePattern('actualizar-calendario')
  async actualizarHorario(
    @Payload() data: number[],
    @Ctx() context: RmqContext,
  ) {
    const mensajeRecibido = JSON.parse(context.getMessage().content);
    console.log('Procesando Solicitud(actualizar-calendario)', mensajeRecibido);
    const entradasProps: EntradaProps[] = mensajeRecibido.body.Entry.map(function (entry: EntradaProps) {
      const entradaProps: EntradaProps = {
        Degree: mensajeRecibido.body.DegreeSet.Degree,
        Year: mensajeRecibido.body.DegreeSet.Year,
        Group: mensajeRecibido.body.DegreeSet.Group,
        Init: entry.Init,
        End: entry.End,
        Subject: entry.Subject,
        Kind: entry.Kind,
        Room: entry.Room,
        Week: entry.Week,
        Weekday: entry.Weekday
      }
      return entradaProps;
    });

    let resultado: string = await this.servicioHorarios.actualizarHorario(mensajeRecibido.body.DegreeSet.Degree, mensajeRecibido.body.DegreeSet.Year, mensajeRecibido.body.DegreeSet.Group, entradasProps);
    console.log(resultado);

    console.log({ resultado: resultado, CorrelationId: mensajeRecibido.id })

    return { resultado: resultado, CorrelationId: mensajeRecibido.id };
  }

  @MessagePattern('obtener-entradas')
  async obtenerEntradas(
    @Payload() data: number[],
    @Ctx() context: RmqContext,
  ) {
    const mensajeRecibido = JSON.parse(context.getMessage().content);
    console.log('Procesando Solicitud(obtener-entradas)', mensajeRecibido);

    let resultado: Entrada[] = await this.servicioHorarios.obtenerEntradas(mensajeRecibido.body.DegreeSet.Degree, mensajeRecibido.body.DegreeSet.Year, mensajeRecibido.body.DegreeSet.Group);
    console.log(resultado);

    console.log({ resultado: resultado, CorrelationId: mensajeRecibido.id })

    return { resultado: resultado, CorrelationId: mensajeRecibido.id };
  }

  @MessagePattern('obtener-horas-disponibles')
  async obtenerHorasDisponibles(
    @Payload() data: number[],
    @Ctx() context: RmqContext,
  ) {
    const mensajeRecibido = JSON.parse(context.getMessage().content);
    console.log('Procesando Solicitud(obtener-horas-disponibles)', mensajeRecibido);

    let resultado: any[] = await this.servicioHorarios.obtenerHorasDisponibles(mensajeRecibido.body.DegreeSet.Degree, mensajeRecibido.body.DegreeSet.Year, mensajeRecibido.body.DegreeSet.Group);
    console.log(resultado);

    console.log({ resultado: resultado, CorrelationId: mensajeRecibido.id })

    return { resultado: resultado, CorrelationId: mensajeRecibido.id };
  }

  @MessagePattern('listar-titulaciones')
  async obtenerTitulaciones(
    @Payload() data: number[],
    @Ctx() context: RmqContext,
  ) {
    const mensajeRecibido = JSON.parse(context.getMessage().content);
    console.log('Procesando Solicitud(listar-titulaciones)', mensajeRecibido);

    let resultado: any[] = await this.servicioHorarios.obtenerTitulaciones();
    console.log(resultado);

    console.log({ resultado: resultado, CorrelationId: mensajeRecibido.id })

    return { resultado: resultado, CorrelationId: mensajeRecibido.id };
  }
}
