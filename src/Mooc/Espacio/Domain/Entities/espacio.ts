import { BaseDomainEntity, Entity, UniqueEntityID, Result } from 'types-ddd';

export interface EspacioProps extends BaseDomainEntity {
  Name: string;
  Capacity: number;
  Building: string;
  Kind: string;
}

export class Espacio extends Entity<EspacioProps> {
  constructor(props: EspacioProps) {
    super(props, Espacio.name);
  }

  public getDatosEspacioProps(): EspacioProps {
    const propsEspacio: EspacioProps = this.props;
    return propsEspacio;
  }
}
