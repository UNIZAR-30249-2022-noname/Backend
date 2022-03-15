"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.procesarSolicitud = void 0;
var amqp = require('amqplib/callback_api');
const queue_name = 'rpc_queue';
const amqplib_1 = __importDefault(require("amqplib"));
class RabbitMQPort {
    constructor() { }
    static receiveRabbitMessage() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield amqplib_1.default.connect(this.amqpURL);
            const channel = yield connection.createChannel();
            yield channel.assertQueue(queue_name, { durable: false });
            channel.prefetch(1);
            console.log(' [x] Awaiting RPC requests');
            channel.consume(queue_name, (msg) => {
                if (msg) {
                    let mensajeRecibido = msg.content.toString();
                    console.log(" [.] procesarSolicitud(%s)", mensajeRecibido);
                    var r = procesarSolicitud(mensajeRecibido);
                    channel.sendToQueue(msg.properties.replyTo, Buffer.from(r.toString()), {
                        correlationId: msg.properties.correlationId
                    });
                    channel.ack(msg);
                }
            });
        });
    }
}
RabbitMQPort.amqpURL = "amqps://draayoqu:7lDJ4nHZhhKGUn2lQCvw8XE4VNuVxMvD@rat.rmq2.cloudamqp.com/draayoqu";
RabbitMQPort.receiveRabbitMessage().catch(err => {
    console.log(err);
});
function procesarSolicitud(mensajeRecibido) {
    return "Solicitud procesada: " + mensajeRecibido;
}
exports.procesarSolicitud = procesarSolicitud;
