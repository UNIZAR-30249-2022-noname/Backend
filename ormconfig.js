
const options = {
  "type": 'postgres',
  "host": (process.env.production) ? 'postgis' : 'localhost',
  "port": (process.env.production) ? 5432 : 25432,
  "username": "proyecto",
  "password": "proyectovm",
  "database": "proyectodb",
  "entities": ["dist/**/*.entity.js","src/**/*.entity.{ts,js}"],
  "ssl": true,
  "extra": {
    "ssl": {
      "rejectUnauthorized": false
    },
  },
  "synchronize": false,
  "migrationsTableName": "migrations",
  "migrations": ["src/Migrations/*.{ts,js}"],
}
module.exports = options