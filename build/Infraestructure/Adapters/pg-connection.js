"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.poolConn = void 0;
//const { Client } = require('pg');
const pg_1 = require("pg");
const poolconfig = {
    database: 'proyectodb',
    host: 'localhost',
    user: 'proyecto',
    password: 'proyectovm',
    port: 25432,
    ssl: { rejectUnauthorized: false },
    max: 20,
    idleTimeoutMillis: 1000,
    connectionTimeoutMillis: 15000, //  Error si despues de 2 segundos no se puede establacer una conexión
};
exports.poolConn = new pg_1.Pool(poolconfig);
const connectToDB = async () => {
    try {
        exports.poolConn.connect().then(() => {
            exports.poolConn.query('SELECT * FROM spatial_ref_sys', (err, res) => {
                if (err)
                    throw err;
                console.log(res);
                exports.poolConn.end();
            });
        });
    }
    catch (err) {
        console.log(err);
    }
};
connectToDB();
