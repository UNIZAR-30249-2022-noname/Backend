//const { Client } = require('pg');
import {PoolConfig, Pool} from "pg";


const poolconfig: PoolConfig = {
    database: 'proyectodb',
    host: 'localhost',
    user: 'proyecto',
    password: 'proyectovm',
    port: 25432,
    ssl: { rejectUnauthorized: false }, // cifrado o no de las peticiones
    max: 20, // tamaño máximo del pool de conexiones.
    idleTimeoutMillis: 1000, // cierra a los clientes que hagan usan de la pool tras 1segndo
    connectionTimeoutMillis: 15000, //  Error si despues de 2 segundos no se puede establacer una conexión
};

export const poolConn = new Pool(poolconfig);

const connectToDB = async () => {
    try {
      poolConn.connect().then(() => {
        poolConn.query('SELECT * FROM spatial_ref_sys', (err, res) => {
          if (err) throw err
          console.log(res)
          poolConn.end()
        })
      });

    } catch (err) {
      console.log(err);
    }
  };
connectToDB();


