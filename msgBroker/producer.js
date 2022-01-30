const Id = require('../utils/id');
const amqp = require('amqplib');

// Connect to rabbitMQ service
const connection = await amqp.connect('amqp://localhost');
// Create producer channel
const channel = await connection.createChannel();


const produceWithReply = async({ queue, replyQueue, content, correlationId }) => {
  await channel.assertQueue(queue);
  channel.sendToQueue(queue,
    Buffer.from(JSON.stringify(content)), {
      correlationId: correlationId,
      replyTo: replyQueue });
};

const produceWithNoReply = async({ queue, content }) => {
  await channel.assertQueue(queue);
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(content)));
}


module.exports = Object.freeze({
  connection,
  channel,
  produceWithReply,
  produceWithNoReply
});


