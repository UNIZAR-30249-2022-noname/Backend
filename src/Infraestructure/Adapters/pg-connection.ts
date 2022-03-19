import {PoolConfig, Pool} from "pg";

const poolconfig: PoolConfig = {
    database: 'postgres',
    user: 'elquesea',
    password: 'elquesea',
    port: 5432,
    //ssl: true, // cifrado o no de las peticiones
    max: 20, // tamaño máximo del pool de conexiones.
    idleTimeoutMillis: 1000, // cierra a los clientes que hagan usan de la pool tras 1segndo
    connectionTimeoutMillis: 2000, //  Error si despues de 2 segundos no se puede establacer una conexión
};

export const poolConn: Pool = new Pool(poolconfig);

