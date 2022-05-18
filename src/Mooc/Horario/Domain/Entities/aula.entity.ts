import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany, PrimaryColumn} from 'typeorm';
import { Degree } from './titulacion.entity';
import { DatosAula } from './datosaula';
import { Entry } from './entrada.entity';

@Entity()
export class Room {
    @Column()
    id: number;

    @Column()
    acronimo: string;

    @PrimaryColumn()
    nombre: string;

    @Column({ nullable: true })
    capacidad: number;

    @Column()
    edificio: number;

    @OneToMany(() => Entry, (entrada) => entrada.nombreaula)
    entradas: Entry[]

    public fillAulaWithDomainEntity(aula: DatosAula){
        this.id = aula.getProps().id;
        this.acronimo = aula.getProps().acronimo;
        this.nombre = aula.getProps().nombre;
        this.capacidad = aula.getProps().capacidad;
        this.edificio = aula.getProps().edificio;
    }
}