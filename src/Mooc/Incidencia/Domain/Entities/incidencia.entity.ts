import { Space } from 'src/Mooc/Espacio/Domain/Entities/espacio.entity';
import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn} from 'typeorm';
import { Incidencia } from './incidencia';

@Entity()
export class Issue {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    titulo: string;

    @Column()
    descripcion: string;

    @Column()
    estado: number;

    @Column()
    etiquetas: string;  // puede que lo pasemos a otra tabla

    @Column()
    espacioid: string;

    @ManyToOne(() => Space, (espacio) => espacio.incidencias)
    @JoinColumn({ 
        name: 'espacioid'
    })
    espacio: Space

    public fillIssueWithDomainEntity(incidencia: Incidencia){
        this.id = parseInt(incidencia.id.toString());
        this.titulo = incidencia.getDatosIncidenciaProps().Title;
        this.descripcion = incidencia.getDatosIncidenciaProps().Description;
        this.estado = incidencia.getDatosIncidenciaProps().State;
        this.etiquetas = incidencia.getDatosIncidenciaProps().Tags.toString();
        this.espacioid = incidencia.getDatosIncidenciaProps().IdSpace;
    }
}