import { Espacio, EspacioProps } from '../Domain/Entities/espacio';
import { EspacioRepository } from '../Domain/EspacioRepository';
import { initializeDBConnector, returnRepository} from '../../../Infraestructure/Adapters/pg-connection';
import { Space } from '../Domain/Entities/espacio.entity';
import { DataSource, InsertResult } from 'typeorm';
import dataSource from '../../../Config/ormconfig_db';

enum EspacioQueries {
  QUERY_BUSCAR_ESPACIO_POR_ID = 'SELECT * FROM espacios WHERE id=$1',
  QUERY_INTRODUCIR_ESPACIO = 'INSERT INTO espacios (id,name,capacity,building,kind) VALUES ($1,$2,$3,$4,$5)',
  QUERY_OBTENER_ESPACIOS = 'SELECT * FROM espacios',
  QUERY_BUSCAR_ESPACIOS_POR_FILTRO = 'SELECT * FROM espacios WHERE capacity>=$1 AND building=$2 AND kind=$3 AND floor=$4',
  //Filtra los espacios si se da una fecha y una hora. fecha != null y hora != null (0)
  QUERY_FILTRAR_ESPACIOS_FECHA_HORA = 'SELECT * FROM space WHERE capacity >= $1 AND floor = ANY ($2) AND building=$3 EXCEPT('
  + ' SELECT * FROM SPACE WHERE id = ANY('
  +    ' SELECT espacioid'
  +   ' FROM reserve'
  +    ' WHERE fecha = $4 AND horainicio = $5'
  +  ')'
  +')'
  ,
  //Filtra los espacios si se da solo una fecha. fecha != null y hora == null.
  QUERY_FILTRAR_ESPACIOS_FECHA = 'SELECT * FROM space WHERE capacity >= $1 AND floor = ANY ($2) AND building=$3 EXCEPT('
  + ' SELECT * FROM SPACE WHERE id = ANY('
  +    ' SELECT espacioid'
  +   ' FROM reserve'
  +    ' WHERE fecha = $4'
  +  ')'
  +')'
  +' UNION'
  +' ('
  +' SELECT * FROM space WHERE id = ANY('
  +  ' SELECT espacioid'
  +  ' FROM reserve'
  +  ' WHERE fecha = $4'
  +  ' GROUP BY espacioid' 
  +  ' HAVING COUNT(*) <= 12'
  +')'
  +')'
  ,
  //hora !=null y fecha == null
  QUERY_FILTRAR_ESPACIOS_HORA = 'SELECT * FROM space WHERE capacity >= $1 AND floor = ANY ($2) AND building=$3 EXCEPT('
  + ' SELECT * FROM SPACE WHERE id = ANY('
  +    ' SELECT espacioid'
  +    ' FROM reserve'
  +    ' WHERE horainicio = $4'
  +  ')'
  +')'
  ,
  //Fecha y hora == null
  QUERY_FILTRAR_ESPACIOS = 'SELECT * FROM space WHERE capacity >= $1 AND floor = ANY ($2) AND building=$3'
}

export class EspacioRepoPGImpl implements EspacioRepository {

  private mapaTraduccionQueries: {[key: number]: {query: string, parameters: (string)[]} } = {
    0: {query: EspacioQueries.QUERY_FILTRAR_ESPACIOS, parameters: ['capacity','floor','building']},
    1: {query: EspacioQueries.QUERY_FILTRAR_ESPACIOS_FECHA, parameters: ['capacity','floor','building','fecha']},
    2: {query: EspacioQueries.QUERY_FILTRAR_ESPACIOS_HORA, parameters: ['capacity','floor','building','hora']},
    3: {query: EspacioQueries.QUERY_FILTRAR_ESPACIOS_FECHA_HORA, parameters: ['capacity','floor','building','fecha','hora']}
  }

  async guardar(espacio: Espacio): Promise<Space> {
    //Inicializar el repositorio para la entidad Space
    const DataSrc: DataSource = await initializeDBConnector(dataSource);
    const SpaceRepo = DataSrc.getRepository(Space)
    const spaceDTO: Space = new Space();
    //Agregamos los atributos a nuestro DTO procedentes de la reserva
    spaceDTO.fillEspacioWithDomainEntity(espacio);
    await SpaceRepo.save(spaceDTO);
    const espacioGuardado: Space = await SpaceRepo.findOne({
      where: {
        id: spaceDTO.id,
      },
    });

    return espacioGuardado;
  }

  async buscarEspacioPorId(id: string): Promise<Space> {
    const DataSrc: DataSource = await initializeDBConnector(dataSource);
    const SpaceRepo = DataSrc.getRepository(Space);
    const EspacioObtenido: Space = await SpaceRepo.findOne({
      where: {
        id: id,
      },
    });

    return EspacioObtenido;
  }

  async filtrarEspaciosReservables(espacioprops: EspacioProps, queryindex: number,fecha?: string, hora?: number): Promise<Space[]> {
    //Inicializamos el conector
    const repositorioReserva = await returnRepository(Space);
    // Destructuramos la query y los parámetros.
    const {query,parameters} = this.mapaTraduccionQueries[queryindex];
    const espacio: Espacio = Espacio.Crear_ActualizarInformacionEspacio(espacioprops);
    //Traduccimos los parámetros.
    const parametrosQuery = sustituirParametros([...parameters], espacio,fecha,hora);
    //Buscamos todos los espacios que cumplan la condición de búsqueda
    const EspaciosObtenidos: Space[] = await repositorioReserva.query(query,parametrosQuery).catch(err => { console.log(err) });
    return EspaciosObtenidos;
  }

  async importarEspacios(espacios: Espacio[]): Promise<InsertResult> {
    const DataSrc: DataSource = await initializeDBConnector(dataSource);
    const SpaceRepo = DataSrc.getRepository(Space);
    const spacesDTO: Space[] = espacios.map(function (espacio) {
      const spaceDTO: Space = new Space();
      spaceDTO.fillEspacioWithDomainEntity(espacio);
      return spaceDTO;
    });
    const espaciosImportados: InsertResult = await SpaceRepo.insert(spacesDTO);
    return espaciosImportados;
  }
}

 function sustituirParametros(parameters: any[], espacio: Espacio,fecha: string,hora: number): any[] {
  
  parameters.forEach((parametro, indice) => {
    switch (parametro) {
      case 'capacity':
        parameters[indice] = espacio.espacioProps.Capacity;
        break;
      case 'floor':
        parameters[indice] =  espacio.espacioProps.Floor;
        break;
      case 'building':
        parameters[indice] = espacio.espacioProps.Building;
        break;
      case 'fecha':
        parameters[indice] = fecha;
        break;
      case 'hora':
       parameters[indice] = hora.toString();
        break;
    }
  });
  return parameters;
}

