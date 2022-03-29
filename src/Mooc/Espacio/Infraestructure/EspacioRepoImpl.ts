import { Espacio, EspacioProps } from '../Domain/Entities/espacio';
import { EspacioRepository } from '../Domain/EspacioRepository';
import { poolConn } from '../../../Infraestructure/Adapters/pg-connection';
import { EspacioQueries } from './EspacioQueries';
import * as crypto from 'crypto';
import { ShortDomainId } from 'types-ddd';

export class EspacioRepoPGImpl implements EspacioRepository {
  async guardar(espacio: Espacio): Promise<boolean> {
    var client = await poolConn.connect();
    const datosEspacio = espacio.getDatosEspacioProps();
    var resultadoQuery = await client.query(
      EspacioQueries.QUERY_INTRODUCIR_ESPACIO,
      [
        datosEspacio,
        datosEspacio.Name,
        datosEspacio.Capacity,
        datosEspacio.Building,
        datosEspacio.Kind,
      ],
    );
    //Analizar resultados devolver una cosa u otra
    client.release();
    return resultadoQuery.rowCount > 0;
  }

  async buscarEspacioPorId(id: String): Promise<Espacio> {
    var client = await poolConn.connect();
    var resultadoQuery = await client.query(
      EspacioQueries.QUERY_BUSCAR_ESPACIO_POR_ID,
      [id],
    );
    client.release();
    console.log(resultadoQuery);
    const espacioprops: EspacioProps = {
      ID: ShortDomainId.create(crypto.randomBytes(64).toString('hex')),
      Name: 'hola',
      Capacity: 50,
      Building: 'hola',
      Kind: 'hola',
    };
    return new Espacio(espacioprops);
  }
}
