import { DatosReserva, DatosReservaProps } from './datosreserva';
import { Espacio } from '../../../Espacio/Domain/Entities/espacio';
import {
  BaseDomainEntity,
  Entity,
  UniqueEntityID,
  Result,
  DomainId,
  ShortDomainId,
} from 'types-ddd';
import { BEntity } from 'src/BaseEntity/BEntity';

export class Reserva extends BEntity{
 
  constructor(id: ShortDomainId,private Datosreserva: DatosReserva, private Espacio: Espacio) { 
    super(id);
  }

  public getDatosReservaProps(): DatosReservaProps {
    return this.Datosreserva.getProps();
  }

  getEspacio(): Espacio{
    return this.Espacio;
  }

}
