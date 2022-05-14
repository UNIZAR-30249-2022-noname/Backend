export interface DatosTitulacionProps {
    readonly codplan: number;
    readonly nombre: string;
    readonly numcursos: number;
    readonly numperiodos: number;
    readonly numgrupos: number[];
  }
  
  export class DatosTitulacion {
  
    private constructor(private propsTitulacion: DatosTitulacionProps) { }
    /**
     * Forzamos una validación contra la lógica de dominio utilizando un constructor
     * privado. Se debe llamar a este método que comprobara la lógica de dominio.
     *
     * @param props datos de una titulacion
     * @returns Crea una titulacion.
     */
    public static async createDatosTitulacion(props: DatosTitulacionProps): Promise<DatosTitulacion> {
        return new DatosTitulacion(props);
    }
  
    public getProps(): DatosTitulacionProps {
      return this.propsTitulacion;
    }
  }