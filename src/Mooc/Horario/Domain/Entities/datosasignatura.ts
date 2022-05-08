export interface DatosAsignaturaProps {
    readonly id: number;
    readonly codasig: number;
    readonly nombre: string;
    readonly area: string;
    readonly codplan: number;
    readonly plan: string;
    readonly curso: number;
    readonly periodo: string;
    readonly destvinculo: number;
    readonly numgrupos: number;
    readonly horasestteoria: number;
    readonly horasestproblemas: number;
    readonly horasestpracticas: number;
  }
  
  export class DatosAsignatura {
  
    private constructor(private propsAsignatura: DatosAsignaturaProps) { }
    /**
     * Forzamos una validación contra la lógica de dominio utilizando un constructor
     * privado. Se debe llamar a este método que comprobara la lógica de dominio.
     *
     * @param props datos de una asignatura
     * @returns Crea una asignatura.
     */
    public static async createDatosAsignatura(props: DatosAsignaturaProps): Promise<DatosAsignatura> {
        return new DatosAsignatura(props);
    }
  
    public getProps(): DatosAsignaturaProps {
      return this.propsAsignatura;
    }
  }