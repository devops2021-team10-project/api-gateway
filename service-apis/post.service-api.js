const sendRequest = require('../msgBroker/genericRequest');

const POST_SERVICE_QUEUES = {
  create:                     "postService_create",
};


const create = async ({ authorUserId, postData, imageInfo }) => {
  return await sendRequest({
    request: { authorUserId, postData, imageInfo },
    queue: POST_SERVICE_QUEUES.create
  });
};


module.exports = Object.freeze({
  create
});