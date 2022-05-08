import { Controller, Get, Query, Post, Body, Put, Param, Delete, Req } from '@nestjs/common';
import { ReservaService } from '../../Mooc/Reserva/Application/reserva.service';
import { ReservaRepoPGImpl } from '../../Mooc/Reserva/Infraestructure/reserva.repository';
import { EspacioService } from '../../Mooc/Espacio/Application/usecase/espacio.service';
import { Espacio, EspacioProps} from '../../Mooc/Espacio/Domain/Entities/espacio';
import { EspacioRepoPGImpl } from '../../Mooc/Espacio/Infraestructure/espacio.repository';
import { IncidenciaService } from '../../Mooc/Incidencia/Application/usecase/incidencia.service';
import { IncidenciaProps } from '../../Mooc/Incidencia/Domain/Entities/incidencia';
import { IncidenciaRepoPGImpl } from '../../Mooc/Incidencia/Infraestructure/incidencia.repository';
import { DatosReservaProps } from '../../Mooc/Reserva/Domain/Entities/datosreserva';
import { HorarioService } from 'src/Mooc/Horario/Application/usecase/horario.service';
import { HorarioRepoPGImpl } from 'src/Mooc/Horario/Infraestructure/horario.repository';

@Controller('test')
export class TestController {

  @Get('/prueba')
  test(){
    return "Hello World"
  }
  

  @Post('/subirEspacios')
  async create() {
    let servicioEspacio: EspacioService = new EspacioService(new EspacioRepoPGImpl());
    const resultado = await servicioEspacio.importarEspacios();
    return(resultado)
  }

  @Post('/subirCursos')
  async subirCursos() {
    let horarioEspacio: HorarioService = new HorarioService(new HorarioRepoPGImpl());
    const resultado = await horarioEspacio.importarCursos();
    return(resultado)
  }

  //PARA ENVIAR EL BODY DESDE POSTMAN HAY QUE UTILIZAR X-WWW-FORM-URLENCODED (RAW BODY NO FUNCIONA)
  @Post('/crearIncidencia')
  async crearIncidencia(@Body() body: IncidenciaProps) {
    console.log(body);
    let servicioIncidencia: IncidenciaService = new IncidenciaService(new IncidenciaRepoPGImpl());
    /*const incidenciaProps: IncidenciaProps = {
      Title: "Incidencia 1",
      Description: "Descripción incidencia 1",
      State: 1,
      Tags: "Etiqueta1,Etiqueta2,Etiqueta3",
      IdSpace: "CRE.1065.00.020",
    }*/
    const resultado = await servicioIncidencia.crearIncidencia(body);
    
    return(resultado);
  }

  @Post('/modificarEstadoIncidencia')
  async modificarEstadoIncidencia(@Body() body: IncidenciaProps) {
    console.log(body);
    let servicioIncidencia: IncidenciaService = new IncidenciaService(new IncidenciaRepoPGImpl());
    const incidenciasObtenidas = await servicioIncidencia.obtenerTodasIncidencias();
    console.log(incidenciasObtenidas);
    const resultado = await servicioIncidencia.modificarEstadoIncidencia(parseInt(incidenciasObtenidas[incidenciasObtenidas.length-1].id.toString()),body.State);
    
    return(resultado);
  }

  @Delete('/eliminarIncidencia')
  async eliminarIncidencia() {
    let servicioIncidencia: IncidenciaService = new IncidenciaService(new IncidenciaRepoPGImpl());
    const incidenciasObtenidas = await servicioIncidencia.obtenerTodasIncidencias();
    console.log(incidenciasObtenidas);
    const resultado = await servicioIncidencia.eliminarIncidencia(parseInt(incidenciasObtenidas[incidenciasObtenidas.length-1].id.toString()));
    
    return(resultado);
  }

  @Post('/eliminarReserva')
  async eliminarReserva(@Body() mensaje: any) {
    let servicioReserva: ReservaService = new ReservaService(new ReservaRepoPGImpl());
    const resultado = await servicioReserva.eliminarReserva(mensaje.id);
    return(resultado)
  }

  @Post('/reserve')
  async crearReserva(@Body() mensaje: any) {
    let servicioReserva: ReservaService = new ReservaService(new ReservaRepoPGImpl());
    const horainicio: number = mensaje.hour
    const horafin:number = mensaje.hourfin
    const evento: string = mensaje.event
    const reservaprops: DatosReservaProps = {
      fecha: mensaje.date,
      horaInicio: horainicio,
      horaFin: horafin,
      Persona: mensaje.person,
    };
    const idEspacio: string = mensaje.space;

    const resultado = await servicioReserva.guardarReserva(reservaprops, idEspacio);
    const idReserva: number = resultado != null ? resultado.id : -1;
    return {id: idReserva};
  }

  @Post('/filtrarEspacios')
  async filtrarEspacios(@Body() mensaje: any) {
    let servicioEspacio: EspacioService = new EspacioService(new EspacioRepoPGImpl());

    const espacioprops: EspacioProps = {
      Name: '',
      Capacity: mensaje.capacity,
      Building: mensaje.building,
      Floor: mensaje.floor,
      Kind: ''
    }
    const fecha: string | null = mensaje.day == undefined ? null : mensaje.day;
    const hour: number | null = mensaje.hour == undefined ? null : mensaje.hour;
    //console.log(fecha,hour)
    //console.log(espacioprops)
    const resultado = await servicioEspacio.filtrarEspacios(espacioprops,fecha,hour)
    return {resultado: resultado};
  }

  @Post('/obtenerEspacios')
  async obtenerEspacios(@Body() mensaje: any) {
    let servicioReserva: ReservaService = new ReservaService(new ReservaRepoPGImpl());
    let servicioEspacios: EspacioService = new EspacioService(new EspacioRepoPGImpl());

    const idEspacio: string = mensaje.id;
    const fecha: string = mensaje.date;
    let InfoSlots =  await servicioReserva.obtenerReservasEspacio(idEspacio,fecha);
    let SlotData = await servicioEspacios.buscarEspacioPorId(idEspacio);
    return {resultado: {InfoSlots,SlotData}};

  }


}

