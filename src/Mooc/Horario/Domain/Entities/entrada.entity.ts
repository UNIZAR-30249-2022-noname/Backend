import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Unique, PrimaryColumn} from 'typeorm';
import { Degree } from './titulacion.entity';
import { DatosAsignatura } from './datosasignatura';
import { Subject } from './asignatura.entity';
import { Entrada } from './entrada';
import { Space } from '../../../../Infraestructure/Persistence/espacio.entity';

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
    duracion: number;

    @Column()
    nombreasignatura: string;

    @Column()
    tipo: number;

    @Column()
    idaula: string;

    @Column()
    semana: string;

    @Column()
    dia: number;

    @Column({default: new Date().toLocaleString('en-GB', { timeZone: 'Europe/Madrid' })})
    fecha: string;

    @ManyToOne(() => Degree, (titulacion) => titulacion.entradas)
    @JoinColumn({ 
        name: 'plan',
        referencedColumnName: 'nombre'
    })
    titulacion: Degree

    @ManyToOne(() => Space, (espacio) => espacio.entradas)
    @JoinColumn({ 
        name: 'idaula',
        referencedColumnName: 'id'
    })
    espacio: Subject

    public fillEntradaWithDomainEntity(entrada: Entrada, duracion: number){
        this.plan = entrada.getDatosEntradaProps().Degree;
        this.curso = entrada.getDatosEntradaProps().Year;
        this.grupo = entrada.getDatosEntradaProps().Group;
        this.inicio = entrada.getDatosEntradaProps().Init;
        this.fin = entrada.getDatosEntradaProps().End;
        this.duracion = duracion;
        this.nombreasignatura = entrada.getDatosEntradaProps().Subject;
        this.tipo = entrada.getDatosEntradaProps().Kind;
        this.idaula = entrada.getDatosEntradaProps().Room;
        this.semana = entrada.getDatosEntradaProps().Week;
        this.dia = entrada.getDatosEntradaProps().Weekday;
        this.fecha = new Date().toLocaleString('en-GB', { timeZone: 'Europe/Madrid' });
    }
}