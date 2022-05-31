import { Space } from './espacio.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Incidencia } from '../../Context/Incidencia/Domain/Entities/incidencia';

@Entity()
export class Issue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column({ nullable: true })
  descripcion: string;

  @Column()
  estado: number;

  @Column({ nullable: true })
  etiquetas: string; // puede que lo pasemos a otra tabla

  @Column()
  espacioid: string;

  @ManyToOne(() => Space, (espacio) => espacio.incidencias)
  @JoinColumn({
    name: 'espacioid',
  })
  espacio: Space;

  public fillIssueWithDomainEntity(incidencia: Incidencia) {
    this.id = parseInt(incidencia.id.toString());
    this.titulo = incidencia.getDatosIncidenciaProps().Title;
    this.descripcion = incidencia.getDatosIncidenciaProps().Description;
    this.estado = incidencia.getDatosIncidenciaProps().State;
    this.etiquetas = incidencia.getDatosIncidenciaProps().Tags.toString();
    this.espacioid = incidencia.getDatosIncidenciaProps().IdSpace;
  }
}
