import {DatosReporte, Reporte} from './Entities/reporte'

export abstract class ReportFactory{

    public static generarReporte(incidencias: any[]): Reporte{
        const reporte: DatosReporte[] = this.crearReporte(incidencias)
        return new Reporte(reporte);
    }

    private static crearReporte(incidencias: any[]): DatosReporte[]{
        const datos_reporte: DatosReporte[] = incidencias.map((issue, _indice) => {
            return new DatosReporte(
                issue.titulo,
                issue.descripcion,
                issue.estado,
                issue.etiquetas.split(","),
                issue.nombre_espacio,
                issue.planta,
                issue.edificio,
              );
          });
          return datos_reporte;
    }

}