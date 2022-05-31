import { RowInput } from "jspdf-autotable";
import { Issue } from "../../../../Infraestructure/Persistence/incidencia.entity";

export class DatosReporte {


    constructor(
        public titulo: string,
        public descripcion: string,
        public estado: number,
        public etiquetas: string,
        public nombre_espacio: string,
        public planta: string,
        public edificio: string) {
        }

    //0 nueva incidencia, 1 en progreso y 2 revisada
    public traducirEstado(estado: number): string {
        if(estado === 0) return "Nueva incidencia"
        else if(estado === 1) return "Bajo revisión"
        else if(estado === 2) return "Revisada"
        else return "Estado desconocido"
    }
 
}

export class Reporte {

    private incidencias_planta: Map<string,number> = new Map([
        ["Sótano",0],
        ["Baja",0],
        ["Primera",0],
        ["Segunda",0],
        ["Tercera",0],
        ["Cuarta",0],
        ["Quinta",0],
    ]);
    private last_index:number = 0;

    constructor(private datosReporte: DatosReporte[]){
        this.datosReporte.forEach( (dato) => {
            this.incidencias_planta.set(dato.planta,this.incidencias_planta.get(dato.planta) + 1)
        })
    }

    public contarPlantasDiferentes(): number {
        var res = [].concat(...this.datosReporte).map(({planta})=>planta);
        var total_diferentes = [...new Set(res)]
        return total_diferentes.length
    }

    public obtenerTotalIncidenciasDeUnaPlanta(planta: string): number {
        return this.incidencias_planta.get(planta);
    }

    public obtenerPlantaIndice(numero: number): string {
        const iterator = this.incidencias_planta.entries();
        for (let i = 0; i < numero ; i++){
            var it_i = iterator.next();
        }
        return it_i.value[0];
    }

    public devolverDatosIesimos(planta: string,index: number): RowInput {
        const indice = this.datosReporte.findIndex( (datos) =>{
            return (datos.planta === planta);
        });
        this.last_index = indice + (index-1);
        const dato: DatosReporte = this.datosReporte[this.last_index];
        const estado_traducido  = dato.traducirEstado(dato.estado)
        return {  
            titulo: dato.titulo, 
            descripcion: dato.descripcion, 
            estado: estado_traducido, 
            etiquetas: dato.etiquetas,
            nombre_espacio: dato.nombre_espacio, 
            edificio: dato.edificio
        };
    }


}