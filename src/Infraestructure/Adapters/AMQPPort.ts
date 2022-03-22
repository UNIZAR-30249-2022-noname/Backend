import client, {Channel,Connection,Replies} from 'amqplib'

export interface AMQP {
    RPCconsumeMessage():void;
    RPCpublishMessage(queue: string,channel: client.Channel,message: any):void;
}