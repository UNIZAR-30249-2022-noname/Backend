import { BEntity } from '../../../../BaseEntity/BEntity';
import {
  buildingValues,
  kindValues,
} from '../../Application/usecase/importarEspaciosValues';

export interface EspacioProps {
  Name: string;
  Capacity: number;
  Building: string;
  Floor: string;
  Kind: string;
}

export class Espacio extends BEntity {
  constructor(id: string, public espacioProps: EspacioProps) {
    super(id);
  }

  public getDatosEspacioProps(): EspacioProps {
    const propsEspacio: EspacioProps = this.espacioProps;
    return propsEspacio;
  }

  public static Crear_ActualizarInformacionEspacio(
    espacioProps: EspacioProps,
  ): Espacio {
    const capacity: number =
      espacioProps.Capacity != null ? espacioProps.Capacity : 1;
    const building: string =
      espacioProps.Building != null ? espacioProps.Building : 'Ada Byron';
    let floor: string = null;
    switch (espacioProps.Building) {
      case 'Ada Byron':
        floor =
          espacioProps.Floor != null
            ? '{' + espacioProps.Floor + '}'
            : `{Baja,Primera,Segunda,Tercera,Cuarta,Quinta}`;
        break;
      default:
        floor =
          espacioProps.Floor != null
            ? '{' + espacioProps.Floor + '}'
            : `{Baja,Primera,Segunda,Tercera}`;
        break;
    }
    return new Espacio(null, {
      Name: espacioProps.Name,
      Capacity: capacity,
      Building: building,
      Floor: floor,
      Kind: espacioProps.Kind,
    });
  }

  public static crearEspacioPersonalizado(espacio: any): Espacio {
    const edificio: string = 'B' + espacio.ID_ESPACIO.split('.')[1];
    const planta = 'F' + espacio.ID_ESPACIO.split('.')[2];
    const espacioprops: EspacioProps = {
      Name: espacio.ID_CENTRO,
      Capacity: espacio.NMRO_PLAZAS,
      Building:
        Object.values(buildingValues)[
          Object.keys(buildingValues).indexOf(edificio)
        ],
      Floor:
        Object.values(buildingValues)[
          Object.keys(buildingValues).indexOf(planta)
        ],
      Kind: Object.values(kindValues)[
        Object.keys(kindValues).indexOf('K' + espacio.TIPO_DE_USO)
      ],
    };
    return new Espacio(espacio.ID_ESPACIO, espacioprops);
  }
}
