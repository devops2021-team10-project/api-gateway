const sendRequest = require('../msgBroker/genericRequest');

const POST_SERVICE_QUEUES = {
  findPostById:               "postService_findPostById",
  findPostsByUserId:          "postService_findPostsByUserId",
  create:                     "postService_create",
};


const findPostById = async ({ postId }) => {
  return await sendRequest({
    request: { postId },
    queue: POST_SERVICE_QUEUES.findPostById
  });
};

const findPostsByUserId = async ({ userId }) => {
  return await sendRequest({
    request: { userId },
    queue: POST_SERVICE_QUEUES.findPostsByUserId
  });
};

const create = async ({ authorUserId, postData, imageInfo }) => {
  return await sendRequest({
    request: { authorUserId, postData, imageInfo },
    queue: POST_SERVICE_QUEUES.create
  });
};


module.exports = Object.freeze({
  findPostById,
  findPostsByUserId,
  create
});