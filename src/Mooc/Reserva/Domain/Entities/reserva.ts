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
 
  constructor(id: string, private Datosreserva: DatosReserva, private idEspacio: string) { 
    super(id);
  }

  public getDatosReservaProps(): DatosReservaProps {
    return this.Datosreserva.getProps();
  }

  public calcularHoraFin(duracion: number): number {
    return this.Datosreserva.calcularHoraFin(duracion);
  }

  getEspacio(): string{
    return this.idEspacio;
  }

}
