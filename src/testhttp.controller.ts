import { Controller, Get, Query, Post, Body, Put, Param, Delete, Req } from '@nestjs/common';
import { EspacioService } from './Mooc/Espacio/Application/usecase/espacio.service';
import { EspacioRepoPGImpl } from './Mooc/Espacio/Infraestructure/espacio.repository';
import { IncidenciaService } from './Mooc/Incidencia/Application/usecase/incidencia.service';
import { IncidenciaProps } from './Mooc/Incidencia/Domain/Entities/incidencia';
import { IncidenciaRepoPGImpl } from './Mooc/Incidencia/Infraestructure/incidencia.repository';

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

}

