import { BEntity } from '../../../../BaseEntity/BEntity';
import { buildingValues, kindValues } from '../../Application/usecase/importarEspaciosValues';

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
        this.espacioProps.Floor = (espacioProps.Floor !== null) ? espacioProps.Floor :`'Sótano','Baja', 'Primera', 'Segunda', 'Tercera','Cuarta','Quinta'`
        break;
      default:
        this.espacioProps.Floor = (espacioProps.Floor !== null) ? espacioProps.Floor :`'Sótano','Baja', 'Primera', 'Segunda', 'Tercera'`
        break;
    }
  }

  public static crearEspacioPersonalizado(espacio: any): Espacio{
    var edificio: string = "B"+ espacio.ID_ESPACIO.split('.')[1];
    var planta = "F" + espacio.ID_ESPACIO.split('.')[2];
    var espacioprops: EspacioProps = {
      Name: espacio.ID_CENTRO,
      Capacity: espacio.NMRO_PLAZAS,
      Building: Object.values(buildingValues)[Object.keys(buildingValues).indexOf(edificio)],
      Floor: Object.values(buildingValues)[Object.keys(buildingValues).indexOf(planta)],
      Kind: Object.values(kindValues)[Object.keys(kindValues).indexOf("K" + espacio.TIPO_DE_USO)],
    };
    return new Espacio(espacio.ID_ESPACIO, espacioprops)
  }

}
