import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany, Unique} from 'typeorm';
import { Degree } from './titulacion.entity';
import { DatosAsignatura } from '../../Context/Horario/Domain/Entities/datosasignatura';
import { Entry } from './entrada.entity';

@Entity()
@Unique(['nombre', 'plan', 'curso'])
export class Subject {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    codasig: number;

    @Column()
    nombre: string;

    @Column()
    area: string;

    @Column()
    codplan: number;

    @Column()
    plan: string;

    @Column()
    curso: number;

    @Column()
    periodo: string;

    @Column({ nullable: true })
    destvinculo: number;

    @Column({ nullable: true })
    numgrupos: number;

    @Column({ type: "numeric", precision: 6, scale: 3})
    horasestteoria: number;

    @Column({ type: "numeric", precision: 6, scale: 3})
    horasestproblemas: number;

    @Column({ type: "numeric", precision: 6, scale: 3})
    horasestpracticas: number;

    @ManyToOne(() => Degree, (titulacion) => titulacion.asignaturas)
    @JoinColumn({ 
        name: 'codplan',
        referencedColumnName: 'codplan'
    })
    titulacion: Degree

    public fillAsignaturaWithDomainEntity(asignatura: DatosAsignatura){
        this.codasig = asignatura.getProps().codasig;
        this.nombre = asignatura.getProps().nombre;
        this.area = asignatura.getProps().area;
        this.codplan = asignatura.getProps().codplan;
        this.plan = asignatura.getProps().plan;
        this.curso = asignatura.getProps().curso;
        this.periodo = asignatura.getProps().periodo;
        this.destvinculo = asignatura.getProps().destvinculo;
        this.numgrupos = asignatura.getProps().numgrupos;
        this.horasestteoria = asignatura.getProps().horasestteoria;
        this.horasestproblemas = asignatura.getProps().horasestproblemas;
        this.horasestpracticas = asignatura.getProps().horasestpracticas;
    }
}