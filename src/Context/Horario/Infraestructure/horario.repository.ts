import { DataSource, DeleteResult, InsertResult, UpdateResult, Repository } from "typeorm";
import { initializeDBConnector, returnRepositoryTest } from '../../../Infraestructure/Adapters/pg-connection';
import dataSource from '../../../Config/ormconfig_db';
import { DatosAsignatura } from "../Domain/Entities/datosasignatura";
import { DatosTitulacion } from "../Domain/Entities/datostitulacion";
import { HorarioRepository } from "../Domain/HorarioRepository";
import { Subject } from "../../../Infraestructure/Persistence/asignatura.entity";
import { Degree } from "../../../Infraestructure/Persistence/titulacion.entity";
import { Entrada } from "../Domain/Entities/entrada";
import { Entry } from "../../../Infraestructure/Persistence/entrada.entity";
import { Inject, Injectable } from "@nestjs/common";

enum HorarioQueries {
    QUERY_TRUNCAR_CURSOS = 'TRUNCATE degree, subject RESTART IDENTITY CASCADE',
    QUERY_OBTENER_HORAS_DISPONIBLES = 'SELECT nombre, tipo, SUM(duracion) AS duracion, horasestteoria, horasestproblemas, horasestpracticas FROM (SELECT * FROM entry WHERE plan=$1 AND curso=$2 AND grupo=$3) AS entry RIGHT JOIN subject ON entry.nombreasignatura=subject.nombre WHERE subject.plan=$1 AND subject.curso=$2 GROUP BY nombreasignatura,nombre,tipo,horasestteoria,horasestproblemas,horasestpracticas ORDER BY nombre',
    QUERY_CONTAR_TITULACIONES = 'SELECT COUNT(*) FROM degree',
    QUERY_CONTAR_ASIGNATURAS = 'SELECT COUNT(*) FROM subject'
}

export class HorarioRepoPGImpl implements HorarioRepository {

    public repositorioEntradas: Repository<Entry>;
    public repositorioAsignaturas: Repository<Subject>;
    public repositorioTitulaciones: Repository<Degree>;

    constructor(@Inject('DataSrc') private datasrcI: DataSource) {
        returnRepositoryTest(Entry, this.datasrcI).then(
            (repo) => {
                this.repositorioEntradas = repo;
            });
        returnRepositoryTest(Subject, this.datasrcI).then(
            (repo) => {
                this.repositorioAsignaturas = repo;
            });
        returnRepositoryTest(Degree, this.datasrcI).then(
            (repo) => {
                this.repositorioTitulaciones = repo;
            });
    }

    async importarCursos(asignaturas: DatosAsignatura[], titulaciones: DatosTitulacion[]): Promise<Boolean> {
        const DataSrc: DataSource = await initializeDBConnector(dataSource);

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
        const result = titulaciones.map(async function (titulacion) {
            const degreeDTO: Degree = new Degree();
            degreeDTO.fillTitulacionWithDomainEntity(titulacion);
            try {
                return await DegreeRepo.insert(degreeDTO);
            } catch (error) {

            }
        });

        await Promise.all(result)
        const titulacionesInsertadas = await DegreeRepo.count();
        console.log(titulacionesInsertadas)

        return titulacionesInsertadas > 0;
    }

    async importarAsignaturas(asignaturas: DatosAsignatura[]): Promise<Boolean> {
        const DataSrc: DataSource = await initializeDBConnector(dataSource);
        //console.log(asignaturas[0])

        // insertar asignaturas
        const SubjectRepo = DataSrc.getRepository(Subject);
        const result = asignaturas.map(async function (asignatura) {
            const subjectDTO: Subject = new Subject();
            subjectDTO.fillAsignaturaWithDomainEntity(asignatura);
            try {
                return await SubjectRepo.insert(subjectDTO);
            } catch (error) {

            }
        });

        await Promise.all(result)
        const asignaturasInsertadas = await SubjectRepo.count();
        console.log(asignaturasInsertadas)

        return asignaturasInsertadas > 0;
    }

    async actualizarHorario(plan: string, curso: number, grupo: string, entradas: Entrada[]): Promise<string> {

        // Primero obtenemos la última fecha en la que se actualizó el horario correspondiente a la titulación, curso y grupo recibidos
        const fechaUltimaActualizacion: Entry = await this.repositorioEntradas.findOne({ select: ['fecha'], where: { plan: plan, curso: curso, grupo: grupo } });
        console.log(fechaUltimaActualizacion === null ? "No existe fecha de última actualización" : fechaUltimaActualizacion.fecha)

        // A continuacón eliminamos el estado actual del horario correspondiente a la titulación, curso y grupo recibidos
        const horarioEliminado: DeleteResult = await this.repositorioEntradas.delete({ plan: plan, curso: curso, grupo: grupo });

        // una vez eliminado, insertamos el nuevo estado del horario
        const entriesDTO: Entry[] = entradas.map(function (entrada) {
            const entryDTO: Entry = new Entry();
            entryDTO.fillEntradaWithDomainEntity(entrada, calcularDuracion(entrada.getDatosEntradaProps().Init, entrada.getDatosEntradaProps().End));
            return entryDTO;
        });
        const horarioActualizado: InsertResult = await this.repositorioEntradas.insert(entriesDTO);

        return fechaUltimaActualizacion === null ? "No existe fecha de última actualización" : fechaUltimaActualizacion.fecha;
    }

    async obtenerEntradas(plan: string, curso: number, grupo: string): Promise<Entry[]> {

        const resultado: Entry[] = await this.repositorioEntradas.findBy({ plan: plan, curso: curso, grupo: grupo });

        return resultado;
    }

    async obtenerHorasDisponibles(plan: string, curso: number, grupo: string): Promise<any[]> {
        const DataSrc: DataSource = await initializeDBConnector(dataSource);
        const tipoHorasPlantilla = ["horasestteoria", "horasestproblemas", "horasestpracticas"]

        const resultadoHorasDisponibles = await DataSrc.query(HorarioQueries.QUERY_OBTENER_HORAS_DISPONIBLES, [plan, curso, grupo]);
        console.log(resultadoHorasDisponibles)
        const resultado: any[] = [];
        resultadoHorasDisponibles.map(function (horasDisponibles: any) {
            for (var i = 0; i < tipoHorasPlantilla.length; i++) {
                const duracionHoras: number = (horasDisponibles.duracion === null || horasDisponibles.tipo != i + 1) ? 0 : parseInt(horasDisponibles.duracion) / 60;
                const duracionMinutos: number = (horasDisponibles.duracion === null || horasDisponibles.tipo != i + 1) ? 0 : parseInt(horasDisponibles.duracion) / 60 % 1 * 60;
                const maxHoras: number = parseInt(horasDisponibles[tipoHorasPlantilla[i]].split(".")[0]);
                const maxMins: number = parseInt(horasDisponibles[tipoHorasPlantilla[i]].split(".")[1]) * 60;
                const AvailableHours = {
                    Subject: {
                        Kind: i + 1,
                        Name: horasDisponibles.nombre,
                    },
                    RemainingHours: Math.floor(maxHoras - duracionHoras),
                    RemainingMin: 60 - Math.abs(maxMins - duracionMinutos),
                    MaxHours: maxHoras,
                    MaxMin: maxMins
                }
                resultado.push(AvailableHours);
            }
        });
        console.log(resultado.length)

        return resultado;
    }

    async obtenerTitulaciones(): Promise<Degree[]> {
        const listaTitulaciones: Degree[] = await this.repositorioTitulaciones.find({ order: { codplan: "ASC" } });

        return listaTitulaciones;
    }
}

function calcularDuracion(inicio: string, fin: string): number {
    const minutosInicio: number = parseInt(inicio.split(":")[0]) * 60 + parseInt(inicio.split(":")[1]);
    const minutosFin: number = parseInt(fin.split(":")[0]) * 60 + parseInt(fin.split(":")[1]);

    return minutosFin - minutosInicio;
}