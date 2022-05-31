import { DatosReserva, DatosReservaProps } from './datosreserva';
import { BEntity } from '../../../../BaseEntity/BEntity';

export class Reserva extends BEntity {
  constructor(
    id: string,
    private Datosreserva: DatosReserva,
    private idEspacio: string,
  ) {
    super(id);
  }

  public getDatosReservaProps(): DatosReservaProps {
    return this.Datosreserva.getProps();
  }

  public calcularHoraFin(duracion: number): void {
     this.Datosreserva.calcularHoraFin(duracion);
  }

  getEspacio(): string {
    return this.idEspacio;
  }
}
