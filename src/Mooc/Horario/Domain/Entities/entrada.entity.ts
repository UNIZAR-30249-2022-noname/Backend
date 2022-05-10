import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Unique, PrimaryColumn} from 'typeorm';
import { Degree } from './titulacion.entity';
import { DatosAsignatura } from './datosasignatura';
import { Subject } from './asignatura.entity';
import { Entrada } from './entrada';

@Entity()
export class Entry {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    plan: string;

    @Column()
    curso: number;

    @Column()
    grupo: string;

    @Column()
    inicio: string;

    @Column()
    fin: string;

    @Column()
    idasignatura: number;

    @Column()
    idaula: number;

    @Column()
    semana: string;

    @Column()
    dia: number;

    @ManyToOne(() => Degree, (titulacion) => titulacion.entradas)
    @JoinColumn({ 
        name: 'plan',
        referencedColumnName: 'nombre'
    })
    titulacion: Degree

    @ManyToOne(() => Subject, (asignatura) => asignatura.entradas)
    @JoinColumn({ 
        name: 'idasignatura'
    })
    asignatura: Subject

    public fillEntradaWithDomainEntity(entrada: Entrada){
        this.plan = entrada.getDatosEntradaProps().Degree;
        this.curso = entrada.getDatosEntradaProps().Year;
        this.grupo = entrada.getDatosEntradaProps().Group;
        this.inicio = entrada.getDatosEntradaProps().Init;
        this.fin = entrada.getDatosEntradaProps().End;
        this.idasignatura = entrada.getDatosEntradaProps().Subject;
        this.idaula = entrada.getDatosEntradaProps().Room;
        this.semana = entrada.getDatosEntradaProps().Week;
        this.dia = entrada.getDatosEntradaProps().Weekday;
    }
}