import { Controller, Get, Query, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { EspacioService } from './Mooc/Espacio/Application/usecase/espacio.service';
import { EspacioRepoPGImpl } from './Mooc/Espacio/Infraestructure/espacio.repository';

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

}

