import { ValueObject } from "types-ddd";
import { PoliticaReserva } from "./politica_reserva";

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
     * @returns Crea una reserva si se cumple con la "PoliticaReserva", sino lanza un error.
     */
    public static createDatosReserva(props: DatosReservaProps): DatosReserva{
        if(PoliticaReserva.seCumple(props)){ //Si se cumple la política se crea el objeto datosRserva
            return new DatosReserva(props)
        }
        else{
           throw new Error("Error al crear la reserva.")
        }
          
    }
    public getasString(): string{
        return this.props.fecha.toString()
    }

    public getProps(): DatosReservaProps {
        return this.props
    }
}