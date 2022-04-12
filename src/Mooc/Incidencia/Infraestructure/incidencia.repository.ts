import { Incidencia } from '../Domain/Entities/incidencia';
import { IncidenciaRepository } from '../Domain/IncidenciaRepository';
import { Issue } from '../Domain/Entities/incidencia.entity';
import dataSource from '../../../Config/ormconfig_db';
import { DataSource, DeleteResult, UpdateResult } from 'typeorm';
import { initializeDBConnector } from '../../../Infraestructure/Adapters/pg-connection';

export class IncidenciaRepoPGImpl implements IncidenciaRepository {

    async guardar(incidencia: Incidencia): Promise<number> {
        const DataSrc: DataSource = await initializeDBConnector(dataSource);
        const IssueRepo = DataSrc.getRepository(Issue)
        const issueDTO: Issue = new Issue();
        issueDTO.fillIssueWithDomainEntity(incidencia);
        await IssueRepo.save(issueDTO);
        const issueHecha: Issue = await IssueRepo.findOne({
            where: {
                id: issueDTO.id,
            },
        });
        
        return issueHecha === null ? -1 : issueHecha.id;
    }

    async actualizarEstado(id: number, state: number): Promise<number> {
        const DataSrc: DataSource = await initializeDBConnector(dataSource);
        const IssueRepo = DataSrc.getRepository(Issue);
        const IncidenciaActualizada: UpdateResult = await IssueRepo.update(id, { estado: state });
        console.log(IncidenciaActualizada);

        return IncidenciaActualizada.affected > 0 ? id : -1;
    }

    async eliminar(id: number): Promise<number> {
        const DataSrc: DataSource = await initializeDBConnector(dataSource);
        const IssueRepo = DataSrc.getRepository(Issue);
        const IncidenciaEliminada: DeleteResult = await IssueRepo.delete(id);
        console.log(IncidenciaEliminada);

        return IncidenciaEliminada.affected > 0 ? id : -1;
    }

    async obtenerTodas(): Promise<Issue[]> {
        const DataSrc: DataSource = await initializeDBConnector(dataSource);
        const IssueRepo = DataSrc.getRepository(Issue);
        const IncidenciasObtenidas: Issue[] = await IssueRepo.find();

        return IncidenciasObtenidas;
    }
}