import { DataSource, DeleteResult, InsertResult } from "typeorm";
import { initializeDBConnector, returnRepository } from '../../../Infraestructure/Adapters/pg-connection';
import dataSource from '../../../Config/ormconfig_db';
import { DatosAsignatura } from "../Domain/Entities/datosasignatura";
import { DatosTitulacion } from "../Domain/Entities/datostitulacion";
import { HorarioRepository } from "../Domain/HorarioRepository";
import { Subject } from "../Domain/Entities/asignatura.entity";
import { Degree } from "../Domain/Entities/titulacion.entity";
import { Entrada } from "../Domain/Entities/entrada";
import { Entry } from "../Domain/Entities/entrada.entity";
import { DatosAula } from "../Domain/Entities/datosaula";
import { Room } from "../Domain/Entities/aula.entity";

enum HorarioQueries {
    QUERY_TRUNCAR_CURSOS = 'TRUNCATE degree, subject RESTART IDENTITY CASCADE',
    QUERY_TRUNCAR_AULAS = 'TRUNCATE room RESTART IDENTITY CASCADE',
    QUERY_OBTENER_HORAS_DISPONIBLES = 'SELECT nombre, tipo, SUM(duracion) AS duracion, horasestteoria, horasestproblemas, horasestpracticas FROM (SELECT * FROM entry WHERE plan=$1 AND curso=$2 AND grupo=$3) AS entry RIGHT JOIN subject ON entry.nombreasignatura=subject.nombre WHERE subject.plan=$1 AND subject.curso=$2 GROUP BY nombreasignatura,nombre,tipo,horasestteoria,horasestproblemas,horasestpracticas'
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

    async importarAulas(aulas: DatosAula[]): Promise<Boolean> {
        const DataSrc: DataSource = await initializeDBConnector(dataSource);
        //console.log(aulas[0])

        // truncamos la tabla de aulas
        await DataSrc.query(HorarioQueries.QUERY_TRUNCAR_AULAS);

        // insertar aulas
        const RoomRepo = DataSrc.getRepository(Room);
        aulas.map(async function (aula) {
            const roomDTO: Room = new Room();
            roomDTO.fillAulaWithDomainEntity(aula);
            try {
                await RoomRepo.insert(roomDTO);
            } catch (error) {
                
            }
        });

        const aulasInsertadas = await RoomRepo.count();
        console.log(aulasInsertadas)

        return true;
    }

    async actualizarHorario(plan: string, curso: number, grupo: string, entradas: Entrada[]): Promise<string> {
        const DataSrc: DataSource = await initializeDBConnector(dataSource);
        const EntryRepo = DataSrc.getRepository(Entry);

        // primero eliminamos el estado actual del horario correspondiente a la titulación, curso y grupo recibidos.
        const horarioEliminado: DeleteResult = await EntryRepo.delete({ plan: plan, curso: curso, grupo: grupo });

        // una vez eliminado, insertamos el nuevo estado del horario
        const entriesDTO: Entry[] = entradas.map(function (entrada) {
            const entryDTO: Entry = new Entry();
            entryDTO.fillEntradaWithDomainEntity(entrada, calcularDuracion(entrada.getDatosEntradaProps().Init, entrada.getDatosEntradaProps().End));
            return entryDTO;
        });
        const horarioActualizado: InsertResult = await EntryRepo.insert(entriesDTO);

        return new Date().toLocaleString('en-GB', { timeZone: 'Europe/Madrid' });
    }

    async obtenerEntradas(plan: string, curso: number, grupo: string): Promise<Entry[]> {
        const DataSrc: DataSource = await initializeDBConnector(dataSource);
        const EntryRepo = DataSrc.getRepository(Entry);

        const resultado: Entry[] = await EntryRepo.findBy({ plan: plan, curso: curso, grupo: grupo });

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
                const duracionHoras: number = (horasDisponibles.duracion === null || horasDisponibles.tipo != i+1) ? 0 : parseInt(horasDisponibles.duracion) / 60;
                const duracionMinutos: number = (horasDisponibles.duracion === null || horasDisponibles.tipo != i+1) ? 0 : parseInt(horasDisponibles.duracion) / 60 % 1 * 60;
                //const maxHoras: number = parseInt(horasDisponibles[tipoHorasPlantilla[horasDisponibles.tipo - 1]].split(".")[0]);
                //const maxMins: number = parseInt(horasDisponibles[tipoHorasPlantilla[horasDisponibles.tipo - 1]].split(".")[1]) * 60;
                const maxHoras: number = parseInt(horasDisponibles[tipoHorasPlantilla[i]].split(".")[0]);
                const maxMins: number = parseInt(horasDisponibles[tipoHorasPlantilla[i]].split(".")[1]) * 60;
                const AvailableHours = {
                    Subject: {
                        Kind: i+1,
                        Name: horasDisponibles.nombre,
                    },
                    RemainingHours: Math.floor(maxHoras - duracionHoras),
                    RemainingMin: Math.abs(maxMins - duracionMinutos),
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
        const DataSrc: DataSource = await initializeDBConnector(dataSource);
        const DegreeRepo = DataSrc.getRepository(Degree);
        const listaTitulaciones: Degree[] = await DegreeRepo.find({order: {codplan: "ASC"}});

        return listaTitulaciones;
    }
}

function calcularDuracion(inicio: string, fin: string): number {
    const minutosInicio: number = parseInt(inicio.split(":")[0]) * 60 + parseInt(inicio.split(":")[1]);
    const minutosFin: number = parseInt(fin.split(":")[0]) * 60 + parseInt(fin.split(":")[1]);

    return minutosFin - minutosInicio;
}