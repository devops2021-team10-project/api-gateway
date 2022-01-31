const amqp = require('amqplib/callback_api');

const init = () => {
  return new Promise((resolve, reject) => {
    console.log("Start producer connecting to RabbitMQ");
    amqp.connect('amqp://user:123456@localhost', (error0, connection) => {
      if (error0) {
        reject(error0);
      }
      console.log("PRODUCER CONNECTED to RabbitMQ");
      connection.createChannel((error1, channel) => {
        if (error1) {
          reject(error1);
        }
        console.log("PRODUCER CHANNEL CREATED on connection");
        resolve(channel);
      });
    });
  });
};

let channelSingleton = null;
const getChannel = async () => {
  if (channelSingleton === null) {
    channelSingleton = await init();
  }
  return channelSingleton;
}

const produceWithReply = async ({ queue, content, correlationId }) => {
  const channel = await getChannel();
  channel.sendToQueue(queue,
    Buffer.from(JSON.stringify(content)), {
      correlationId: correlationId,
      replyTo: "apiGateway_replyQueue"
  });
};

const produceWithNoReply = async ({ queue, content }) => {
  const channel = await getChannel();
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(content)));
}


module.exports = Object.freeze({
  getChannel,
  produceWithReply,
  produceWithNoReply
});


