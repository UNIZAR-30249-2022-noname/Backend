import { Espacio } from '../Domain/Entities/espacio';
import { EspacioRepository } from '../Domain/EspacioRepository';
import { initializeDBConnector} from '../../../Infraestructure/Adapters/pg-connection';
import * as crypto from 'crypto';
import { ShortDomainId } from 'types-ddd';
import { Space } from '../Domain/Entities/espacio.entity';
import { DataSource, InsertResult } from 'typeorm';
import dataSource from '../../../Config/ormconfig_db';

enum EspacioQueries {
  QUERY_BUSCAR_ESPACIO_POR_ID = 'SELECT * FROM espacios WHERE id=$1',
  QUERY_INTRODUCIR_ESPACIO = 'INSERT INTO espacios (id,name,capacity,building,kind) VALUES ($1,$2,$3,$4,$5)',
  QUERY_OBTENER_ESPACIOS = 'SELECT * FROM espacios',
  QUERY_BUSCAR_ESPACIOS_POR_FILTRO = 'SELECT * FROM espacios WHERE capacity>=$1 AND building=$2 AND kind=$3 AND floor=$4',
  //SELECT * FROM space WHERE id=(SELECT espacioId FROM reserve r WHERE NOT (r.fecha='10/04/2022' AND ('11' >= r.horainicio AND '11' < r.horafin))) AND capacity>=1 AND building='CRE.1065.' AND kind='17' AND floor='00.095'
  //Filtra los espacios si se da una fecha y una hora.
  QUERY_FILTRAR_ESPACIOS_FECHA_HORA = 'SELECT * FROM space WHERE capacity >= $1 AND floor IN ($2) AND building=$3 EXCEPT('
  + ' SELECT * FROM SPACE WHERE id = ANY('
  +    'SELECT espacioid'
  +   'FROM reserve'
  +    'WHERE fecha = $4 AND ( $5 >= horainicio AND  $5 < horafin)'
  +  ')'
  +')'
  ,
  //Filtra los espacios si se da solo una fecha. TODO: Añadir condiciones de capacidad, edificio, floor y kind.
  QUERY_FILTRAR_ESPACIOS_FECHA = 'SELECT * FROM space WHERE capacity >= $1 AND floor IN ($2) AND building=$3 EXCEPT('
  + ' SELECT * FROM SPACE WHERE id = ANY('
  +    'SELECT espacioid'
  +   'FROM reserve'
  +    'WHERE fecha = $4'
  +  ')'
  +')'
  +'UNION'
  +'('
  +'SELECT * FROM space WHERE id = ANY('
  +  'SELECT espacioid'
  +  'FROM reserve'
  +  'WHERE fecha = $4'
  +  'GROUP BY espacioid' 
  +  'HAVING COUNT(*) <=11'
  +')'
  +')'
  ,
  QUERY_FILTRAR_ESPACIOS_HORA = 'SELECT * FROM space WHERE capacity >= $1 AND floor IN ($2) AND building=$3 EXCEPT('
  + ' SELECT * FROM SPACE WHERE id = ANY('
  +    'SELECT espacioid'
  +   'FROM reserve'
  +    `WHERE fecha >= '01/01/1900' AND ( $5 >= horainicio AND  $5 < horafin)`
  +  ')'
  +')'
  ,
  QUERY_FILTRAR_ESPACIOS = 'SELECT * FROM space WHERE capacity >= 1 AND floor IN ($2) AND building=$3'
}

export class EspacioRepoPGImpl implements EspacioRepository {
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

  async filtrarEspaciosReservables(espacioprops: Espacio,fecha?: string, hora?: number): Promise<Space[]> {
    //Inicializamos el conector
    const DataSrc: DataSource = await initializeDBConnector(dataSource);
    const SpaceRepo = DataSrc.getRepository(Space);
    
    //Buscamos todos los espacios que cumplan la condición de búsqueda
    const EspaciosObtenidos: Space[] = await SpaceRepo.query(EspacioQueries.QUERY_FILTRAR_ESPACIOS_FECHA_HORA)
    console.log(EspaciosObtenidos);
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
