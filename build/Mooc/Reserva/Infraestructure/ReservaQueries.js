"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservaQueries = void 0;
var ReservaQueries;
(function (ReservaQueries) {
    ReservaQueries["QUERY_BUSCAR_RESERVA"] = "SELECT x,y,j FROM latablaquesea WHERE loquesea";
    ReservaQueries["QUERY_INTRODUCIR_RESERVA"] = "INSERT into latablaquesea VALUES ($1,$2)";
})(ReservaQueries = exports.ReservaQueries || (exports.ReservaQueries = {}));
