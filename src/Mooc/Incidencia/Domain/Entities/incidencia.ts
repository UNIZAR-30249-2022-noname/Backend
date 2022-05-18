import { BEntity } from '../../../../BaseEntity/BEntity';

export interface IncidenciaProps {
  Title: string;
  Description: string;
  State: number;
  Tags: string[];
  IdSpace: string;
}

export class Incidencia extends BEntity {
  constructor(id: string, private incidenciaProps: IncidenciaProps) {
    super(id);
  }

  public getDatosIncidenciaProps(): IncidenciaProps {
    const propsIncidencia: IncidenciaProps = this.incidenciaProps;
    return propsIncidencia;
  }
}
