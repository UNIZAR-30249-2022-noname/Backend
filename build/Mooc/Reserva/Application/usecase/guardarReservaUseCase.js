"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.servicioReservaImpl = void 0;
const datosreserva_1 = require("../../Domain/Entities/datosreserva");
const reserva_1 = require("../../Domain/Entities/reserva");
const types_ddd_1 = require("types-ddd");
const crypto = __importStar(require("crypto"));
class servicioReservaImpl {
    constructor(Reservarepository) {
        this.Reservarepository = Reservarepository;
    }
    async guardarReserva(datosreservaprops, espacio) {
        try {
            //<--Para construir un objeto Reserva igual estaría bien hacer un Factory porque hay mucho código por aqui-->
            //Creamos el objeto valor reserva y validamos la lógica de negocio para crear una reserva.
            console.log("Me llaman");
            const Datos_Reserva = datosreserva_1.DatosReserva.createDatosReserva(datosreservaprops);
            //Creamos los datos de la reserva, si se ha validado la lógica de dominio.
            const reservaprops = {
                Datosreserva: Datos_Reserva,
                Espacio: espacio,
                ID: types_ddd_1.ShortDomainId.create(crypto.randomBytes(64).toString('hex')),
            };
            const reserva = new reserva_1.Reserva(reservaprops);
            //return await this.Reservarepository.guardar(reserva)
            return true;
        }
        catch (error) {
            return false;
        }
    }
}
exports.servicioReservaImpl = servicioReservaImpl;
