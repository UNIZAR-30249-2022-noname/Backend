import { Space } from 'src/Mooc/Espacio/Domain/Entities/espacio.entity';
import {Entity, Column, PrimaryGeneratedColumn, ManyToOne} from 'typeorm';
import {DatosReserva, DatosReservaProps} from './datosreserva';
import { Reserva } from './reserva';

@Entity()
export class Reserve {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    fecha: string;

    @Column()
    horaInicio: string;

    @Column()
    horaFin: string;

    @Column()
    persona: string;

    @ManyToOne(() => Space, (espacio) => espacio.reservas)
    espacio: Space

   
    constructor() { }

    public fillReserveWithDomainEntity(reserva: Reserva){
        this.fecha = reserva.getDatosReservaProps().fecha;
        this.horaInicio = reserva.getDatosReservaProps().horaInicio;
        this.horaFin = reserva.getDatosReservaProps().horaFin;
        this.persona = reserva.getDatosReservaProps().Persona;
    }

}