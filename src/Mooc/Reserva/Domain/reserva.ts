import {DatosReserva} from './datosreserva'
import { 
    BaseDomainEntity, 
    Entity, 
    UniqueEntityID, 
    Result
  } from 'types-ddd';

interface ReservaProps extends BaseDomainEntity {
    datosreserva: DatosReserva;
}

export class Reserva extends Entity<ReservaProps> {

    //public readonly espacio: Espacio; falta crear esta entidad del Dominio

    constructor(props: ReservaProps) {
        super(props,Reserva.name);
    }
}