"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitMQConfig = void 0;
const amqplib_1 = __importDefault(require("amqplib"));
class RabbitMQConfig {
    //public EXCHANGE: String;
    //public ROUTING_KEY: String;
    constructor(ReqQueue, ReplyQueue, AMQPURL) {
        this.AmqpURL = "amqps://draayoqu:7lDJ4nHZhhKGUn2lQCvw8XE4VNuVxMvD@rat.rmq2.cloudamqp.com/draayoqu";
        this.RequestQueueName = ReqQueue;
        this.ReplyQueueName = ReplyQueue;
        if (AMQPURL)
            this.AmqpURL = AMQPURL;
    }
    async createRPCQueue() {
        const connection = await amqplib_1.default.connect(this.AmqpURL);
        const channel = await connection.createChannel();
        await channel.assertQueue(this.RequestQueueName, { durable: false });
        channel.prefetch(1);
        return channel;
    }
}
exports.RabbitMQConfig = RabbitMQConfig;
