import { PoolConfig, Pool } from 'pg';
import { DataSource } from 'typeorm';
import dataSource from '../../Config/ormconfig_db'

var Puerto = 25432;
var Host = 'localhost';

if (process.env.production) {
   Puerto = 5432;
   Host = 'postgis'
}

console.log("Conectando con la base de datos: %s:%d",Host,Puerto);

export async function initializeDBConnector(datasrc: DataSource){
  if (!datasrc.isInitialized){
    datasrc = await dataSource.initialize();
  }
  return datasrc;
}
