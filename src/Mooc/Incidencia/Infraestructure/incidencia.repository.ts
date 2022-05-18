import { Incidencia } from '../Domain/Entities/incidencia';
import { IncidenciaRepository } from '../Domain/IncidenciaRepository';
import { Issue } from '../Domain/Entities/incidencia.entity';
import dataSource from '../../../Config/ormconfig_db';
import { DataSource, DeleteResult, Repository, UpdateResult } from 'typeorm';
import { initializeDBConnector, returnRepositoryTest } from '../../../Infraestructure/Adapters/pg-connection';
import { Inject, Injectable } from '@nestjs/common';

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

  async actualizarEstado(id: number, state: number): Promise<number> {
    const IncidenciaActualizada: UpdateResult = await this.repositorioIncidencias.update(id, {
      estado: state,
    });
    console.log(IncidenciaActualizada);
    return IncidenciaActualizada.affected > 0 ? id : -1;
  }

  async eliminar(id: number): Promise<number> {
    const IncidenciaEliminada: DeleteResult = await this.repositorioIncidencias.delete(id);
    console.log(IncidenciaEliminada);
    return IncidenciaEliminada.affected > 0 ? id : -1;
  }

  async obtenerTodas(): Promise<Issue[]> {
    const IncidenciasObtenidas: Issue[] = await this.repositorioIncidencias.find();
    return IncidenciasObtenidas;
  }
}
