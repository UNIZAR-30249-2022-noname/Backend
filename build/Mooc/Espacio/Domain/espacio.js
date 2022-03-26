"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Espacio = void 0;
const types_ddd_1 = require("types-ddd");
class Espacio extends types_ddd_1.Entity {
    constructor(props) {
        super(props, Espacio.name);
    }
}
exports.Espacio = Espacio;
