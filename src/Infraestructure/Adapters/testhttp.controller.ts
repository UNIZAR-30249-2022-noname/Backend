import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Req,
  Inject,
  Res,
} from '@nestjs/common';
import {
  ReservaService,
  servicioReservaI,
} from '../../Mooc/Reserva/Application/reserva.service';
import { ReservaRepoPGImpl } from '../../Mooc/Reserva/Infraestructure/reserva.repository';
import { EspacioService, servicioEspacioI } from '../../Mooc/Espacio/Application/usecase/espacio.service';
import { Espacio, EspacioProps } from '../../Mooc/Espacio/Domain/Entities/espacio';
import { EspacioRepoPGImpl } from '../../Mooc/Espacio/Infraestructure/espacio.repository';
import { IncidenciaService, servicioIncidenciaI } from '../../Mooc/Incidencia/Application/usecase/incidencia.service';
import { IncidenciaProps } from '../../Mooc/Incidencia/Domain/Entities/incidencia';
import { IncidenciaRepoPGImpl } from '../../Mooc/Incidencia/Infraestructure/incidencia.repository';
import { DatosReservaProps } from '../../Mooc/Reserva/Domain/Entities/datosreserva';
import { HorarioService, servicioHorarioI } from '../../Mooc/Horario/Application/usecase/horario.service';
import { HorarioRepoPGImpl } from '../../Mooc/Horario/Infraestructure/horario.repository';
import { EntradaProps } from '../../Mooc/Horario/Domain/Entities/entrada';
import { Response } from 'express';


@Controller('test')
export class TestController {
  constructor(
    @Inject('servicioReservaI')
    private readonly servicioReservas: servicioReservaI,
    @Inject('servicioEspacioI')
    private readonly servicioEspacios: servicioEspacioI,
    @Inject('servicioIncidenciaI')
    private readonly servicioIncidencias: servicioIncidenciaI,
    @Inject('servicioHorarioI')
    private readonly servicioHorarios: servicioHorarioI,
  ) {}

  @Get('/prueba')
  test() {
    return "Hello World"
  }

  @Post('/subirCursos')
  async subirCursos() {
    const resultado = await this.servicioHorarios.importarCursos();
    return (resultado)
  }

  @Post('/subirEspacios')
  async create() {
    const resultado = await this.servicioEspacios.importarEspaciosAuto();
    return resultado;
  }


  //PARA ENVIAR EL BODY DESDE POSTMAN HAY QUE UTILIZAR X-WWW-FORM-URLENCODED (RAW BODY NO FUNCIONA)
  @Post('/crearIncidencia')
  async crearIncidencia(@Body() body: IncidenciaProps) {
    console.log(body);
    const resultado = await this.servicioIncidencias.crearIncidencia(body);
    return resultado;
  }

  @Post('/modificarEstadoIncidencia')
  async modificarEstadoIncidencia(@Body() body: IncidenciaProps) {
    console.log(body);
    const incidenciasObtenidas =
      await this.servicioIncidencias.obtenerTodasIncidencias();
    console.log(incidenciasObtenidas);
    const resultado = await this.servicioIncidencias.modificarEstadoIncidencia(
      parseInt(
        incidenciasObtenidas[incidenciasObtenidas.length - 1].id.toString(),
      ),
      body.State,
    );

    return resultado;
  }

  @Delete('/eliminarIncidencia')
  async eliminarIncidencia() {
    const incidenciasObtenidas =
      await this.servicioIncidencias.obtenerTodasIncidencias();
    console.log(incidenciasObtenidas);
    const resultado = await this.servicioIncidencias.eliminarIncidencia(
      parseInt(
        incidenciasObtenidas[incidenciasObtenidas.length - 1].id.toString(),
      ),
    );

    return resultado;
  }

  @Post('/eliminarReserva')
  async eliminarReserva(@Body() mensaje: any) {
    const resultado = await this.servicioReservas.eliminarReserva(mensaje.id);
    return { resultado: resultado };
  }

  @Post('/reserve')
  async crearReserva(@Body() mensaje: any) {
    console.log(mensaje);
    const horainicio: number = mensaje.hour;
    const horafin: number = mensaje.hourfin;
    const reservaprops: DatosReservaProps = {
      fecha: mensaje.date,
      horaInicio: horainicio,
      horaFin: horafin,
      Persona: mensaje.person,
      evento: mensaje.evento,
    };
    const idEspacio: string = mensaje.space;

    const resultado = await this.servicioReservas.guardarReserva(
      reservaprops,
      idEspacio,
    );
    const idReserva: number = resultado != null ? resultado.id : -1;
    return { id: idReserva };
  }

  @Post('/filtrarEspacios')
  async filtrarEspacios(@Body() mensaje: any) {
    const espacioprops: EspacioProps = {
      Name: '',
      Capacity: mensaje.capacity,
      Building: mensaje.building,
      Floor: mensaje.floor,
      Kind: '',
    };
    const fecha: string | null = mensaje.day == undefined ? null : mensaje.day;
    const hour: number | null = mensaje.hour == undefined ? null : mensaje.hour;
    //console.log(fecha,hour)
    //console.log(espacioprops)
    const resultado = await this.servicioEspacios.filtrarEspacios(
      espacioprops,
      fecha,
      hour,
    );
    return { resultado: resultado, longitud: resultado.length };
  }

  @Post('/obtenerEspacios')
  async obtenerEspacios(@Body() mensaje: any) {
    const idEspacio: string = mensaje.id;
    const fecha: string = mensaje.date;
    const InfoSlots = await this.servicioReservas.obtenerReservasEspacio(
      idEspacio,
      fecha,
    );
    const SlotData = await this.servicioEspacios.buscarEspacioPorId(idEspacio);
    return { resultado: { InfoSlots, SlotData } };

  }

  @Post('/descargarPDF')
  async descargarPDF(@Body() mensaje: any ,@Res() res: Response,
  ) {
    const edificio: string = mensaje.edificio;
    const array_buffer_pdf: ArrayBuffer = await this.servicioIncidencias.descargarPDFIncidencias(edificio);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Length': array_buffer_pdf.byteLength,
    });
    var newBuffer = Buffer.from(array_buffer_pdf)
    res.end(newBuffer)

  }

  

  @Post('/actualizarHorario')
  async actualizarHorario(@Body() mensaje: any) {

    let resultadoActualizarHorario = await this.servicioHorarios.actualizarHorario(DegreeSet.Degree, DegreeSet.Year, DegreeSet.Group, entradasPropsTest);

    return { resultado: { resultadoActualizarHorario } };
  }

  @Get('/obtenerEntradas')
  async obtenerEntradas(@Body() mensaje: any) {

    let resultadoActualizarHorario = await this.servicioHorarios.obtenerEntradas(DegreeSet.Degree, DegreeSet.Year, DegreeSet.Group);

    return { resultado: { resultadoActualizarHorario } };
  }

  @Get('/obtenerHorasDisponibles')
  async obtenerHorasDisponibles(@Body() mensaje: any) {

    let resultado = await this.servicioHorarios.obtenerHorasDisponibles(DegreeSet.Degree, DegreeSet.Year, DegreeSet.Group);

    return { resultado: { resultado } };
  }

  @Get('/obtenerTitulaciones')
  async obtenerTitulaciones(@Body() mensaje: any) {

    let resultado = await this.servicioHorarios.obtenerTitulaciones();

    return { resultado: { resultado } };
  }
}

const DegreeSet = {
  Degree: "Graduado en Ingeniería Informática",
  Year: 1,
  Group: "mañanas",
}

const entradasPropsTest: EntradaProps[] = [
  {
    Degree: "Graduado en Ingeniería Informática",
    Year: 1,
    Group: "mañanas",
    Init: "8:00",
    End: "9:00",
    Subject: "Programación 1",
    Kind: 1,
    Room: "CRE.1200.00.040",
    Week: "Semana 1",
    Weekday: 1
  },
  {
    Degree: "Graduado en Ingeniería Informática",
    Year: 1,
    Group: "mañanas",
    Init: "9:00",
    End: "10:00",
    Subject: "Arquitectura y organización de computadores 1",
    Kind: 2,
    Room: "CRE.1200.00.040",
    Week: "Semana 1",
    Weekday: 1
  },
  {
    Degree: "Graduado en Ingeniería Informática",
    Year: 1,
    Group: "mañanas",
    Init: "10:00",
    End: "11:00",
    Subject: "Física y electrónica",
    Kind: 3,
    Room: "CRE.1200.00.040",
    Week: "Semana 1",
    Weekday: 1
  },
  {
    Degree: "Graduado en Ingeniería Informática",
    Year: 1,
    Group: "mañanas",
    Init: "11:00",
    End: "13:30",
    Subject: "Programación 1",
    Kind: 1,
    Room: "CRE.1200.00.040",
    Week: "Semana 1",
    Weekday: 1
  }
]

    
  

