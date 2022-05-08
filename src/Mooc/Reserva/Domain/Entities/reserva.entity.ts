import { Space } from '../../../Espacio/Domain/Entities/espacio.entity';
import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Unique} from 'typeorm';
import {DatosReserva, DatosReservaProps} from './datosreserva';
import { Reserva } from './reserva';

@Entity()
@Unique(['horainicio','fecha'])
export class Reserve {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    fecha: string;

    @Column()
    horainicio: string;

    @Column()
    horafin: string;

    @Column({ type: "varchar", length: 100})
    persona: string;

    @Column({ type: "varchar", length: 50})
    espacioid: string;

    @Column({type: "varchar", length: 500,nullable: true})
    evento: string;

    @ManyToOne(() => Space, (espacio) => espacio.reservas)
    @JoinColumn({ 
        name: 'espacioid'
    })
    espacio: Space

   
    constructor() { }

    public fillReserveWithDomainEntity(reserva: Reserva){
        this.fecha = reserva.getDatosReservaProps().fecha;
        this.horainicio = reserva.getDatosReservaProps().horaInicio.toString();
        this.horafin = reserva.getDatosReservaProps().horaFin.toString();
        this.persona = reserva.getDatosReservaProps().Persona;
        this.espacioid = reserva.getEspacio();
        this.evento = reserva.getDatosReservaProps().evento;
    }

}