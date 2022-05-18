import { Incidencia, IncidenciaProps } from '../../Domain/Entities/incidencia';
import { IncidenciaRepository } from '../../Domain/IncidenciaRepository';
import { Injectable, Inject } from '@nestjs/common';
import { Issue } from '../../Domain/Entities/incidencia.entity';

export interface servicioIncidenciaI {
  crearIncidencia(incidenciaProps: IncidenciaProps): Promise<number>;
  modificarEstadoIncidencia(id: number, state: number): Promise<number>;
  eliminarIncidencia(id: number): Promise<number>;
  obtenerTodasIncidencias(): Promise<Incidencia[]>;
}

@Injectable()
export class IncidenciaService implements servicioIncidenciaI {
  constructor(
    @Inject('IncidenciaRepository')
    private readonly incidenciarepository: IncidenciaRepository,
  ) {}

  async crearIncidencia(incidenciaProps: IncidenciaProps): Promise<number> {
    const IncidenciaACrear: Incidencia = new Incidencia('0', incidenciaProps);
    const incidenciaCreada: number = await this.incidenciarepository.guardar(
      IncidenciaACrear,
    );

    return incidenciaCreada;
  }

  async modificarEstadoIncidencia(id: number, state: number): Promise<number> {
    const IncidenciaModificada: number =
      await this.incidenciarepository.actualizarEstado(id, state);

    return IncidenciaModificada;
  }

  async eliminarIncidencia(id: number): Promise<number> {
    const IncidenciaEliminada: number =
      await this.incidenciarepository.eliminar(id);

    return IncidenciaEliminada;
  }

  async obtenerTodasIncidencias(): Promise<Incidencia[]> {
    const IssuesObtenidas: Issue[] =
      await this.incidenciarepository.obtenerTodas();
    const IncidenciasObtenidas: Incidencia[] = IssuesObtenidas.map(function (
      IssueObtenida,
    ) {
      const incidenciaprops: IncidenciaProps = {
        Title: IssueObtenida.titulo,
        Description: IssueObtenida.descripcion,
        State: IssueObtenida.estado,
        Tags: IssueObtenida.etiquetas.split(','),
        IdSpace: IssueObtenida.espacioid,
      };
      return new Incidencia(IssueObtenida.id.toString(), incidenciaprops);
    });

    return IncidenciasObtenidas;
  }
}
