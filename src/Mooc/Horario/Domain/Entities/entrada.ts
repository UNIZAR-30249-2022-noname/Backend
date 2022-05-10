import { BEntity } from '../../../../BaseEntity/BEntity';

export interface EntradaProps{
  Degree: string;
  Year: number;
  Group: string;
  Init: string;
  End: string;
  Subject: number;
  Room: number;
  Week: string;
  Weekday: number;
}

export class Entrada extends BEntity {
  constructor(
    id: string,
    public  entradaProps: EntradaProps
  ) {
    super(id);
  }


  public getDatosEntradaProps(): EntradaProps {
    const propsEntrada: EntradaProps = this.entradaProps;
    return propsEntrada;
  }
}