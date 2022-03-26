"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*Todo esto es una prueba para probar el docker, luego se borrara ya que la única forma de hablar con el backend
 debe ser a traves del gateway usando las colas de rabbit.*/
const express_1 = __importDefault(require("express"));
require("reflect-metadata");
// Create Express server
const app = (0, express_1.default)();
// Express configuration
app.set("port", process.env.PORT || 2750);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/prueba", (req, res) => {
    res.send("Backend funcionando!");
});
exports.default = app;
