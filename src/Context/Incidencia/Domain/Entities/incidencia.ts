import { Assert } from '../../../../shared/assert';
import { BEntity } from '../../../../BaseEntity/BEntity';
import { Issue } from '../../../../Infraestructure/Persistence/incidencia.entity';
import { estadoValido } from '../estadoValido';
import estadoValidoException from '../estadoValidoException';

export enum estadoIncidencia {
  NUEVA_INCIDENCIA = 0,
  INCIDENCIA_EN_REVISION = 1,
  INCIDENCIA_REVISADA = 2,
}

export interface IncidenciaProps {
  Title: string;
  Description: string;
  State: estadoIncidencia;
  Tags: string[];
  IdSpace?: string;
}

export class Incidencia extends BEntity {

  constructor(id: string, private incidenciaProps: IncidenciaProps) {
    super(id);
  }

  public getDatosIncidenciaProps(): IncidenciaProps {
    const propsIncidencia: IncidenciaProps = this.incidenciaProps;
    return propsIncidencia;
  }
  /*
  *Pre: nuevoEstado es un estado válido en nuestro dominio representado por los números 0,1  y 2.
  (Nueva incidencia, Incidencia en revisión, Incidencia revisada).
  *Post: Estado de la incidencia es igual a  nuevoEstado
  */
  public actualizarEstado(nuevoEstado: number){
    Assert(estadoValido.validarEstadoIncidencia(nuevoEstado),estadoValidoException.WRONG_STATE_MSG);
    this.incidenciaProps.State = nuevoEstado;
  }

  public static rehidratarIncidenciasFromDB(
    issuesDTO: Issue[],
  ): Incidencia[] {
    const incidencias: Incidencia[] = issuesDTO.map((issue, indice) => {
      return new Incidencia(
        null,
        {
          Title: issue.titulo,
          Description: issue.descripcion,
          State: issue.estado,
          Tags: issue.etiquetas.split(","),
        });
    });
    return incidencias;
  }
}
