import { Incidencia } from '../Domain/Entities/incidencia';
import { IncidenciaRepository } from '../Domain/IncidenciaRepository';
import { Issue } from '../../../Infraestructure/Persistence/incidencia.entity';
import dataSource from '../../../Config/ormconfig_db';
import { DataSource, DeleteResult, Repository, UpdateResult } from 'typeorm';
import { initializeDBConnector, returnRepositoryTest } from '../../../Infraestructure/Adapters/pg-connection';
import { Inject, Injectable } from '@nestjs/common';
import { Space } from '../../../Infraestructure/Persistence/espacio.entity';

enum IncidenciaQueries {
  QUERY_OBTENER_NOMBRE_ESPACIO = 'SELECT name FROM space WHERE id=$1'
}

@Injectable()
export class IncidenciaRepoPGImpl implements IncidenciaRepository {

  public repositorioIncidencias: Repository<Issue>;

  constructor(@Inject('DataSrc') private datasrcI: DataSource) {
    returnRepositoryTest(Issue, this.datasrcI).then(
      (repo) => {
      this.repositorioIncidencias = repo;
    });
  }

  async guardar(incidencia: Incidencia): Promise<number> {
    const issueDTO: Issue = new Issue();
    issueDTO.fillIssueWithDomainEntity(incidencia);
    await this.repositorioIncidencias.save(issueDTO);
    const issueHecha: Issue = await this.repositorioIncidencias.findOne({
      where: {
        id: issueDTO.id,
      },
    });

    return issueHecha === null ? -1 : issueHecha.id;
  }

  async obtenerPorId(id: number): Promise<Issue> {
    const IncidenciaObtenida: Issue = await this.repositorioIncidencias.findOneBy({ id: id })
    console.log(IncidenciaObtenida);
    return IncidenciaObtenida;
  }

  async actualizarEstado(incidencia: Incidencia): Promise<number> {
    const IncidenciaActualizada: UpdateResult = await this.repositorioIncidencias.update(parseInt(incidencia.id.toString()), {
      estado: incidencia.getDatosIncidenciaProps().State,
    });
    console.log(IncidenciaActualizada);
    return IncidenciaActualizada.affected > 0 ? parseInt(incidencia.id.toString()) : -1;
  }

  async eliminar(id: number): Promise<number> {
    const IncidenciaEliminada: DeleteResult = await this.repositorioIncidencias.delete(id);
    console.log(IncidenciaEliminada);
    return IncidenciaEliminada.affected > 0 ? id : -1;
  }

  async obtenerTodas(): Promise<Issue[]> {
    const DataSrc: DataSource = await initializeDBConnector(dataSource);

    const IncidenciasObtenidas: Issue[] = await this.repositorioIncidencias.find();
    await Promise.all(IncidenciasObtenidas.map(async function (
      IncidenciaObtenida,
    ) {
      const nombreEspacio = await DataSrc.query(IncidenciaQueries.QUERY_OBTENER_NOMBRE_ESPACIO, [IncidenciaObtenida.espacioid]);
      IncidenciaObtenida.espacioid = nombreEspacio[0].name;
    }));

    return IncidenciasObtenidas;
  }

  /**
   * 
   *   select DISTINCT i.titulo,s.name, i.descripcion,i.estado, i.etiquetas,s.floor from issue i
   *   INNER JOIN space s
   *   ON i.espacioid = s.id AND s.building = 'Ada Byron'
   *   ORDER by s.floor,i.estado ASC;
   */

  async obtenerIncidenciasPorEdificio(edificio: string): Promise<Issue[]> {
    const listado_issues: Issue[] = await 
    this.repositorioIncidencias
      .createQueryBuilder('i')
      .select(['i.titulo as titulo','i.descripcion as descripcion',
               'i.estado as estado','i.etiquetas as etiquetas',
               's.name as nombre_espacio','s.floor as planta',
               's.building as edificio'])
      .distinct(true)
      .innerJoin(Space,'s','s.id = i.espacioid')
      .where('s.building = :edificio', {edificio})
      .orderBy('s.floor,i.estado',"ASC")
      .getRawMany();
    return listado_issues;
  }
}
