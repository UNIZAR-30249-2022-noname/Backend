import client, {Channel,Connection,Replies} from 'amqplib'

export class RabbitMQConfig{

    private AmqpURL: string = "amqps://draayoqu:7lDJ4nHZhhKGUn2lQCvw8XE4VNuVxMvD@rat.rmq2.cloudamqp.com/draayoqu";
    public QueueName: string;
    //public EXCHANGE: String;
    //public ROUTING_KEY: String;

    constructor(Queue:string,AMQPURL:string | null) {
        this.QueueName = Queue;
        if (AMQPURL) this.AmqpURL = AMQPURL;
    }

    public async createRPCQueue(): Promise<Channel> {
        const connection:Connection = await client.connect(this.AmqpURL)
        const channel: Channel = await connection.createChannel()
        await channel.assertQueue(this.QueueName,{durable: false});
        return channel
    }

}