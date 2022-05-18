export interface DatosAulaProps {
    readonly id: number;
    readonly acronimo: string;
    readonly nombre: string;
    readonly capacidad: number;
    readonly edificio: number;
  }
  
  export class DatosAula {
  
    private constructor(private propsAula: DatosAulaProps) { }
    /**
     * Forzamos una validación contra la lógica de dominio utilizando un constructor
     * privado. Se debe llamar a este método que comprobara la lógica de dominio.
     *
     * @param props datos de un aula
     * @returns Crea un aula.
     */
    public static async createDatosAula(props: DatosAulaProps): Promise<DatosAula> {
        return new DatosAula(props);
    }
  
    public getProps(): DatosAulaProps {
      return this.propsAula;
    }
  }