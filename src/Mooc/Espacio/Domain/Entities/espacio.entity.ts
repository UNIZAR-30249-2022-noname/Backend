import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm';
import { Reserve } from '../../../Reserva/Domain/Entities/reserva.entity';
import { Espacio } from './espacio';

@Entity()
export class Space {
    @PrimaryGeneratedColumn({})
    id: number;
    
    @Column({ type: "varchar", length: 50})
    name: string;

    @Column({ type: "integer"})
    Capacity: number;

    @Column({ type: "varchar", length: 25})
    Building: string;

    @Column({ type: "varchar", length: 50})
    Kind: string;
    
    @OneToMany(() => Reserve, (reserve) => reserve.espacio)
    reservas: Reserve[]

   
    constructor() { }

    public fillEspacioWithDomainEntity(espacio: Espacio){
        this.name = espacio.getDatosEspacioProps().Name;
        this.Capacity = espacio.getDatosEspacioProps().Capacity;
        this.Building = espacio.getDatosEspacioProps().Building;
        this.Kind = espacio.getDatosEspacioProps().Kind;
    }

}