var amqp = require('amqplib/callback_api');
var amqpURL = "amqps://draayoqu:7lDJ4nHZhhKGUn2lQCvw8XE4VNuVxMvD@rat.rmq2.cloudamqp.com/draayoqu";

amqp.connect(amqpURL, function(error0: any, connection: any) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1: any, channel: any) {
    if (error1) {
      throw error1;
    }
    var queue = 'rpc_queue';

    channel.assertQueue(queue, {
      durable: false
    });
    channel.prefetch(1);
    console.log(' [x] Awaiting RPC requests');
    channel.consume(queue, function reply(msg: any) {
      var mensajeRecibido = msg.content.toString();

      console.log(" [.] procesarSolicitud(%s)", mensajeRecibido);

      var r = procesarSolicitud(mensajeRecibido);

      channel.sendToQueue(msg.properties.replyTo,
        Buffer.from(r.toString()), {
          correlationId: msg.properties.correlationId
        });

      channel.ack(msg);
    });
  });
});

export function procesarSolicitud(mensajeRecibido: any) {
  return "Solicitud procesada: " +  mensajeRecibido;
}