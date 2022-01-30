const Id = require("../utils/id");
const brokerConsumer = require("../msgBroker/consumer");
const brokerProducer = require("../msgBroker/producer");

const sendRequest = async ({ request, queue }) => {
  return new Promise((resolve, reject) => {
    const correlationId = Id.makeId();
    brokerConsumer.consumeCorrelated({
      queue,
      correlationId
    }).then(response => {
      resolve(response);
    }).catch((e) => {
      reject(e);
    });

    brokerProducer.produceWithReply({
      queue,
      replyQueue: queue,
      request,
      correlationId
    });
  });
};

module.exports = sendRequest;