const Id = require('../utils/id');
const amqp = require('amqplib');

// Connect to rabbitMQ service
const connection = await amqp.connect('amqp://localhost');
// Create consumer channel
const channel = await connection.createChannel();


const timeoutError = Symbol();
const timeout = ({ prom, time, exception }) => {
  let timer;
  return Promise.race([
    prom,
    new Promise((_r, rej) => timer = setTimeout(rej, time, exception))
  ]).finally(() => clearTimeout(timer));
}


const consumeCorrelated = async ({ queue, correlationId }) => {
  await channel.assertQueue(queue);
  const consumePromise = new Promise((resolve, _reject) => {
    channel.consume(queue, (msg) => {
      if ((msg.properties.correlationId) === correlationId) {
        resolve(JSON.parse(msg.content));
      }
    }, {
      noAck: true
    });
  });

  return await timeout({
    prom: consumePromise,
    time: 3000,
    exception: timeoutError
  });
}


const consumeAny = async ({ queue }) => {
  await channel.assertQueue(queue);
  const consumePromise = new Promise((resolve, _reject) => {
    channel.consume(queue, (msg) => {
      resolve(JSON.parse(msg.content));
      channel.ack(msg);
    });
  });

  return await timeout({
    prom: consumePromise,
    time: 3000,
    exception: timeoutError
  });
}

module.exports = Object.freeze({
  connection,
  channel,
  consumeAny,
  consumeCorrelated
});
