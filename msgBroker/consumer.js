const amqp = require('amqplib/callback_api');
const eventEmitter = require('./eventEmittler');


const initReplyConsumer = () => new Promise((resolve, reject) => {
    console.log("Start reply-CONSUMER connecting to RabbitMQ");
    amqp.connect('amqp://user:123456@localhost', (error0, connection) => {
      if (error0) {
        reject(error0);
      }
      connection.createChannel((error1, channel) => {
        if (error1) {
          reject(error1);
        }
        channel.assertQueue("apiGateway_replyQueue", { exclusive: false }, () => {
          channel.consume("apiGateway_replyQueue", (msg) => {
            eventEmitter.emit(String(msg.properties.correlationId), msg);
          }, {
            noAck: true
          });
          console.log("reply-CONSUMER connected to RabbitMQ");
          resolve();
        });
      });
    });
});



module.exports = Object.freeze({
  initReplyConsumer,
});
