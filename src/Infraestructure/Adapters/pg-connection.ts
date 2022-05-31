import { DataSource, Repository } from 'typeorm';
import dataSource from '../../Config/ormconfig_db';

let Puerto = 25432;
let Host = 'localhost';

if (process.env.production) {
  Puerto = 5432;
  Host = 'postgis';
}

console.log('Conectando con la base de datos: %s:%d', Host, Puerto);

export async function initializeDBConnector(datasrc: DataSource) {
  if (!datasrc.isInitialized) {
    datasrc = await datasrc.initialize();
  }
  return datasrc;
}

export async function returnRepositoryTest(
  target: any,
  dataSrc: DataSource,
): Promise<Repository<any>> {
  const DataSrc: DataSource = await initializeDBConnector(dataSrc);
  const repository = DataSrc.getRepository(target);
  return repository;
}

