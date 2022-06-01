import { estadoIncidencia } from "./Entities/incidencia";

export abstract class estadoValido{

    public static validarEstadoIncidencia(estado: number): boolean
    {
        return(
            Number(estado) === estadoIncidencia.NUEVA_INCIDENCIA 
        ||Number(estado) === estadoIncidencia.INCIDENCIA_REVISADA 
        || Number(estado) === estadoIncidencia.INCIDENCIA_EN_REVISION);
    }
}