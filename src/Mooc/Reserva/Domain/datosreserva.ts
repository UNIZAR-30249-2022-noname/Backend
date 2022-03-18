import { ValueObject } from "types-ddd";

export interface DatosReservaProps{
    readonly fecha: Date;
    readonly horaInicio: string;
    readonly horaFin: string;
}

export class DatosReserva extends ValueObject<DatosReservaProps> {


    private constructor(propsReserva: DatosReservaProps){   
        super(propsReserva);
    }
    /**
     * Forzamos una validación contra la lógica de dominio utilizando un constructor
     * privado. Se debe llamar a este método que comprobara la lógica de dominio.
     * 
     * @param props datos de una reserva
     * @returns Crea una reserva si se cumple con la "politicaReserva", sino lanza un error.
     */
    public static createDatosReserva(props: DatosReservaProps) {
        //if(politicaReserva.seCumple(props)){ Definir la política de reserva que sea.
            return new DatosReserva(props)
        //}
        //else{
        //    throw new Error("Error al crear la reserva por lo que sea")
        //}
          
      }
}