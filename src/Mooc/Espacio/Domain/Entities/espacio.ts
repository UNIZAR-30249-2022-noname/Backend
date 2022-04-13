import { BEntity } from '../../../../BaseEntity/BEntity';

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

  public actualizarInformacionEspacio(espacioProps: EspacioProps) {
    this.espacioProps.Capacity = (espacioProps.Capacity !== null) ? espacioProps.Capacity : 1;
    this.espacioProps.Building = (espacioProps.Building !== null) ? espacioProps.Building : 'Ada Byron'
    switch (this.espacioProps.Building) {
      case 'Ada Byron':
        this.espacioProps.Floor = (espacioProps.Floor !== null) ? espacioProps.Floor :'(Sótano, Baja, Primera, Segunda, Tercera, Cuarta, Quinta)'
        break;
      default:
        this.espacioProps.Floor = (espacioProps.Floor !== null) ? espacioProps.Floor :'(Sótano, Baja, Primera, Segunda, Tercera)'
        break;
    }
  }

}
