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
const RabbitMQAdapter_1 = require("../../../Infraestructure/Adapters/RabbitMQAdapter");
const RabbitMQConfig_1 = require("../../../Configuration/RabbitMQConfig");
const guardarReservaUseCase_1 = require("../Application/usecase/guardarReservaUseCase");
const ReservaRepoImpl_1 = require("./ReservaRepoImpl");
const espacio_1 = require("../../Espacio/Domain/espacio");
const types_ddd_1 = require("types-ddd");
const crypto = __importStar(require("crypto"));
class ReservasMQAdapter extends RabbitMQAdapter_1.RabbitMQAdapter {
    constructor(RabbitConfig, servicioReservas) {
        super(RabbitConfig);
        this.servicioReservas = servicioReservas;
    }
    async setupChannelAdapter() {
        return await this.mqConfig.createRPCQueue();
    }
    async RPCconsumeMessage() {
        console.log(' [x] Awaiting RPC requests');
        const channel = await this.setupChannelAdapter();
        channel.consume(this.mqConfig.RequestQueueName, async (msg) => {
            if (msg) {
                let mensajeRecibido = msg.content.toString();
                console.log(" [.] procesarSolicitud(%s)", mensajeRecibido);
                const reservaprops = {
                    fecha: new Date(),
                    horaInicio: '10:00',
                    horaFin: '12:00'
                };
                let id = types_ddd_1.ShortDomainId.create(crypto.randomBytes(64).toString('hex'));
                const espacio = new espacio_1.Espacio({ ID: id, Name: "hola", Capacity: 15, Building: "Ada", Kind: "Sanidad" });
                let resultadoOperacion = await this.servicioReservas.guardarReserva(reservaprops, espacio);
                console.log(resultadoOperacion);
                channel.sendToQueue(msg.properties.replyTo, Buffer.from(msg.toString()), {
                    correlationId: '1234',
                });
                channel.ack(msg);
            }
        });
    }
    RPCpublishMessage(queue, channel, message) {
    }
}
/**
 * Ejecución main
 */
const req_queue_name = 'rpc_queue';
const rep_queue_name = 'rpc_queue';
const servicioReservas = new guardarReservaUseCase_1.servicioReservaImpl(new ReservaRepoImpl_1.ReservaRepoPGImpl());
const reservasAdapter = new ReservasMQAdapter(new RabbitMQConfig_1.RabbitMQConfig(req_queue_name, rep_queue_name, null), servicioReservas);
reservasAdapter.RPCconsumeMessage();
