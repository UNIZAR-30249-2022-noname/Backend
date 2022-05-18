import { DataSource } from 'typeorm';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.production ? 'postgis' : 'localhost',
  port: process.env.production ? 5432 : 25432,
  username: 'proyecto',
  password: 'proyectovm',
  database: 'proyectodb',
  entities: ['src/**/*.entity.ts', 'dist/**/*.entity.js'],
  ssl: true,
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
  synchronize: false,
  migrationsTableName: 'migrations',
  migrations: ['src/Migrations/*.{ts,js}'],
});
export default dataSource;
