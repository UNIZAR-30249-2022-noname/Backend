import { DataSource, InsertResult } from "typeorm";
import { initializeDBConnector, returnRepository } from '../../../Infraestructure/Adapters/pg-connection';
import dataSource from '../../../Config/ormconfig_db';
import { DatosAsignatura } from "../Domain/Entities/datosasignatura";
import { DatosTitulacion } from "../Domain/Entities/datostitulacion";
import { HorarioRepository } from "../Domain/HorarioRepository";
import { Subject } from "../Domain/Entities/asignatura.entity";
import { Degree } from "../Domain/Entities/titulacion.entity";

enum HorarioQueries {
    QUERY_TRUNCAR_CURSOS = 'TRUNCATE degree, subject RESTART IDENTITY CASCADE',
}

export class HorarioRepoPGImpl implements HorarioRepository {

    async importarCursos(asignaturas: DatosAsignatura[], titulaciones: DatosTitulacion[]): Promise<Boolean> {
        const DataSrc: DataSource = await initializeDBConnector(dataSource);
        const SubjectRepo = DataSrc.getRepository(Subject);
        const DegreeRepo = DataSrc.getRepository(Degree);

        // truncamos las tablas de titulaciones y asignaturas
        await DataSrc.query(HorarioQueries.QUERY_TRUNCAR_CURSOS);

        // importamos primero las titulaciones y luego las asignaturas (por la dependencias de foreign keys)
        const importarTitulacionesResultado = await this.importarTitulaciones(titulaciones);
        const importarAsignaturasResultado = await this.importarAsignaturas(asignaturas);

        return importarTitulacionesResultado && importarAsignaturasResultado;
    }

    async importarTitulaciones(titulaciones: DatosTitulacion[]): Promise<Boolean> {
        const DataSrc: DataSource = await initializeDBConnector(dataSource);
        //console.log(titulaciones[0])

        // insertar titulaciones
        const DegreeRepo = DataSrc.getRepository(Degree);
        titulaciones.map(async function (titulacion) {
            const degreeDTO: Degree = new Degree();
            degreeDTO.fillTitulacionWithDomainEntity(titulacion);
            try {
                await DegreeRepo.insert(degreeDTO);
            } catch (error) {

            }
        });

        const titulacionesInsertadas = await DegreeRepo.count();
        console.log(titulacionesInsertadas)

        return true;
    }

    async importarAsignaturas(asignaturas: DatosAsignatura[]): Promise<Boolean> {
        const DataSrc: DataSource = await initializeDBConnector(dataSource);
        //console.log(asignaturas[0])

        // insertar asignaturas
        const SubjectRepo = DataSrc.getRepository(Subject);
        asignaturas.map(async function (asignatura) {
            const subjectDTO: Subject = new Subject();
            subjectDTO.fillAsignaturaWithDomainEntity(asignatura);
            try {
                await SubjectRepo.insert(subjectDTO);
            } catch (error) {

            }
        });

        const asignaturasInsertadas = await SubjectRepo.count();
        console.log(asignaturasInsertadas)

        return true;
    }
}