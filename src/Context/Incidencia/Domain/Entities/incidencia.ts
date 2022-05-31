import { BEntity } from '../../../../BaseEntity/BEntity';
import { Issue } from '../../../../Infraestructure/Persistence/incidencia.entity';

export interface IncidenciaProps {
  Title: string;
  Description: string;
  State: number;
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

  public actualizarEstado(nuevoEstado: number){
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
