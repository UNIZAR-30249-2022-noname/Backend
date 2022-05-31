import {Entity, Column, PrimaryGeneratedColumn, OneToMany, PrimaryColumn} from 'typeorm';
import { Subject } from './asignatura.entity';
import { DatosTitulacion } from './datostitulacion';
import { Entry } from './entrada.entity';

@Entity()
export class Degree {
    @PrimaryColumn({unique: true, type: "integer"})
    codplan: number;
    
    @Column({unique: true, type: "varchar", length: 100})
    nombre: string;

    @Column({ type: "integer"})
    numcursos: number;

    @Column({ type: "integer"})
    numperiodos: number;

    @Column({ type: "varchar"})
    numgrupos: string;

    @OneToMany(() => Subject, (asignatura) => asignatura.codplan)
    asignaturas: Subject[]

    @OneToMany(() => Entry, (entrada) => entrada.titulacion)
    entradas: Entry[]
   
    constructor() { }

    public fillTitulacionWithDomainEntity(titulacion: DatosTitulacion){
        this.codplan = titulacion.getProps().codplan;
        this.nombre = titulacion.getProps().nombre;
        this.numcursos = titulacion.getProps().numcursos;
        this.numperiodos = titulacion.getProps().numperiodos;
        this.numgrupos = titulacion.getProps().numgrupos.toString();
    }

}