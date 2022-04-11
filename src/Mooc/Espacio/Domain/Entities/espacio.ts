import { BEntity } from 'src/BaseEntity/BEntity';
import { Reserva } from 'src/Mooc/Reserva/Domain/Entities/reserva';
import { BaseDomainEntity, Entity, Result, ShortDomainId } from 'types-ddd';

export interface EspacioProps{
  Name: string;
  Capacity: number;
  Building: string;
  Floor: string;
  Kind: string;
}

export class Espacio extends BEntity {
  constructor(
    id: string,
    private  espacioProps: EspacioProps
  ) {
    super(id);
  }


  public getDatosEspacioProps(): EspacioProps {
    const propsEspacio: EspacioProps = this.espacioProps;
    return propsEspacio;
  }

}
