import { Espacio, EspacioProps } from '../Domain/Entities/espacio';
import { EspacioRepository } from '../Domain/EspacioRepository';
import { initializeDBConnector, poolConn } from '../../../Infraestructure/Adapters/pg-connection';
import * as crypto from 'crypto';
import { ShortDomainId } from 'types-ddd';
import { Space } from '../Domain/Entities/espacio.entity';
import { DataSource, InsertResult } from 'typeorm';
import dataSource from 'src/Config/ormconfig_db';

enum EspacioQueries {
  QUERY_BUSCAR_ESPACIO_POR_ID = 'SELECT * FROM espacios WHERE id=$1',
  QUERY_INTRODUCIR_ESPACIO = 'INSERT INTO espacios (id,name,capacity,building,kind) VALUES ($1,$2,$3,$4,$5)',
  QUERY_OBTENER_ESPACIOS = 'SELECT * FROM espacios',
  QUERY_BUSCAR_ESPACIOS_POR_FILTRO = 'SELECT * FROM espacios WHERE capacity>=$1 AND building=$2 AND kind=$3 AND floor=$4',
  QUERY_FILTRAR_ESPACIOS = 'SELECT * FROM space WHERE id=(SELECT espacioId FROM reserve WHERE NOT fecha=$1 OR NOT horaInicio=$2) AND Capacity>=$1 AND Building=$2 AND Kind=$3 AND floor=$4'
}

export class EspacioRepoPGImpl implements EspacioRepository {
  async guardar(espacio: Espacio): Promise<Space> {
    //Inicializar el repositorio para le entidad Space
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

  async filtrarEspaciosReservables(capacity: number, day: string, hour: string, floor: string, building: string, kind: string): Promise<any> {
    const DataSrc: DataSource = await initializeDBConnector(dataSource);
    const SpaceRepo = DataSrc.getRepository(Space);
    const EspaciosObtenidos: any = await SpaceRepo.query(EspacioQueries.QUERY_FILTRAR_ESPACIOS)
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
    console.log(espaciosImportados)
    
    return espaciosImportados;
  }
}
