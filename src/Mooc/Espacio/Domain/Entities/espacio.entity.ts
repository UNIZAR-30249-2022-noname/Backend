import {Entity, Column, PrimaryGeneratedColumn, OneToMany, PrimaryColumn} from 'typeorm';
import { Reserve } from '../../../Reserva/Domain/Entities/reserva.entity';
import { Espacio } from './espacio';

@Entity()
export class Space {
    @PrimaryColumn({ type: "varchar", length: 50})
    id: string;
    
    @Column({ type: "varchar", length: 50})
    name: string;

    @Column({ type: "integer"})
    Capacity: number;

    @Column({ type: "varchar", length: 25})
    Building: string;

    @Column({ type: "varchar", length: 25})
    Floor: string;

    @Column({ type: "varchar", length: 50})
    Kind: string;
    
    @OneToMany(() => Reserve, (reserve) => reserve.espacio)
    reservas: Reserve[]

   
    constructor() { }

    public fillEspacioWithDomainEntity(espacio: Espacio){
        this.id = espacio.getDatosEspacioProps().Id;
        this.name = espacio.getDatosEspacioProps().Name;
        this.Capacity = espacio.getDatosEspacioProps().Capacity;
        this.Building = espacio.getDatosEspacioProps().Building;
        this.Floor = espacio.getDatosEspacioProps().Floor;
        this.Kind = espacio.getDatosEspacioProps().Kind;
    }

}