import {DatosReserva,DatosReservaProps} from './datosreserva'
import {Espacio} from '../../../Espacio/Domain/espacio'
import { 
    BaseDomainEntity, 
    Entity, 
    UniqueEntityID, 
    Result,
    DomainId
  } from 'types-ddd';

export interface ReservaProps extends BaseDomainEntity {
    Datosreserva: DatosReserva;
    Espacio: Espacio;
}

export class Reserva extends Entity<ReservaProps> {

    constructor(props: ReservaProps) {
        super(props,Reserva.name);
    }
    
    public getDatosReservaProps(): DatosReservaProps {
        const propsReserva: DatosReservaProps = this.props.Datosreserva.getProps();
        return propsReserva;
    }
}