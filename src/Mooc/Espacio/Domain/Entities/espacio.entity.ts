import { Issue } from '../../../Incidencia/Domain/Entities/incidencia.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { Reserve } from '../../../Reserva/Domain/Entities/reserva.entity';
import { Espacio } from './espacio';
import { Entry } from 'src/Mooc/Horario/Domain/Entities/entrada.entity';

@Entity()
export class Space {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'integer' })
  capacity: number;

  @Column({ type: 'varchar', length: 100 })
  building: string;

  @Column({ type: 'varchar', length: 25 })
  floor: string;

  @Column({ type: 'varchar', length: 100 })
  kind: string;

  @OneToMany(() => Reserve, (reserve) => reserve.espacio)
  reservas: Reserve[];

  @OneToMany(() => Issue, (issue) => issue.espacio)
  incidencias: Issue[];

  @OneToMany(() => Entry, (entry) => entry.espacio)
  entradas: Entry[];

  constructor() {}

  public fillEspacioWithDomainEntity(espacio: Espacio) {
    this.id = espacio.id.toString();
    this.name = espacio.getDatosEspacioProps().Name;
    this.capacity = espacio.getDatosEspacioProps().Capacity;
    this.building = espacio.getDatosEspacioProps().Building;
    this.floor = espacio.getDatosEspacioProps().Floor;
    this.kind = espacio.getDatosEspacioProps().Kind;
  }
}
