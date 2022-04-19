import { DataSource } from "typeorm";


const dataSource = new DataSource({
  "type": 'postgres',
  "host": process.env.production ? 'postgis' : 'localhost',
  "port": (process.env.production) ? 5432 : 25432,
  "username": "proyecto",
  "password": "proyectovm",
  "database": "proyectodb",
  "entities": ["dist/**/*.entity.js"],
  "ssl": true,
  "extra": {
    "ssl": {
      "rejectUnauthorized": false
    },
  },
  "synchronize": false,
  "migrationsTableName": "migrations",
  "migrations": ["dist/Migrations/*.js"],
});
export default dataSource;