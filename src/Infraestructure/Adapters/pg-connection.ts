//const { Client } = require('pg');
import { PoolConfig, Pool } from 'pg';

var Puerto = 25432;
var Host = 'localhost';

if (process.env.production) {
   Puerto = 5432;
   Host = 'postgis'
}

console.log("Conectando con la base de datos: %s:%d",Host,Puerto);

const poolconfig: PoolConfig = {
  database: 'proyectodb',
  host: Host,
  user: 'proyecto',
  password: 'proyectovm',
  port: Puerto,
  ssl: { rejectUnauthorized: false }, // cifrado o no de las peticiones
  max: 20, // tamaño máximo del pool de conexiones.
  idleTimeoutMillis: 1000, // cierra a los clientes que hagan usan de la pool tras 1segndo
  connectionTimeoutMillis: 15000, //  Error si despues de 2 segundos no se puede establacer una conexión
};

export const poolConn = new Pool(poolconfig);