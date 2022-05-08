import {Entity, Column, PrimaryGeneratedColumn, OneToMany, PrimaryColumn} from 'typeorm';
import { Subject } from './asignatura.entity';
import { DatosTitulacion } from './datostitulacion';

@Entity()
export class Degree {
    @PrimaryColumn({ type: "integer"})
    codplan: number;
    
    @Column({ type: "varchar", length: 100})
    nombre: string;

    @Column({ type: "integer"})
    numcursos: number;

    @Column({ type: "integer"})
    numperiodos: number;

    @Column({ type: "integer"})
    numgrupos: number;

    @OneToMany(() => Subject, (asignatura) => asignatura.codplan)
    asignaturas: Subject[]

   
    constructor() { }

    public fillTitulacionWithDomainEntity(titulacion: DatosTitulacion){
        this.codplan = titulacion.getProps().codplan;
        this.nombre = titulacion.getProps().nombre;
        this.numcursos = titulacion.getProps().numcursos;
        this.numperiodos = titulacion.getProps().numperiodos;
        this.numgrupos = titulacion.getProps().numgrupos;
    }

}