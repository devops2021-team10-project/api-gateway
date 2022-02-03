const sendRequest = require('../msgBroker/genericRequest');

const POST_SERVICE_QUEUES = {
  findPostById:               "postService_findPostById",
  findAllPostsILike:          "postService_findAllPostsILike",
  findAllPostsIDislike:       "postService_findAllPostsIDislike",
  findPostsByUserId:          "postService_findPostsByUserId",
  create:                     "postService_create",
  createCampaign:             "postService_createCampaign",

  changeLikedPost:            "postService_changeLikedPost",
  changeDislikedPost:         "postService_changeDislikedPost",

  createComment:              "postService_createComment"
};


const findPostById = async ({ postId }) => {
  return await sendRequest({
    request: { postId },
    queue: POST_SERVICE_QUEUES.findPostById
  });
};

const findAllPostsILike = async ({ userId }) => {
  return await sendRequest({
    request: { userId },
    queue: POST_SERVICE_QUEUES.findAllPostsILike
  });
};

const findAllPostsIDislike = async ({ userId }) => {
  return await sendRequest({
    request: { userId },
    queue: POST_SERVICE_QUEUES.findAllPostsIDislike
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

const changeLikedPost = async ({ userId, toLikePostId, isLiked }) => {
  return await sendRequest({
    request: { userId, toLikePostId, isLiked },
    queue: POST_SERVICE_QUEUES.changeLikedPost
  });
};

const changeDislikedPost = async ({ userId, toDislikePostId, isDisliked }) => {
  return await sendRequest({
    request: { userId, toDislikePostId, isDisliked },
    queue: POST_SERVICE_QUEUES.changeDislikedPost
  });
};

const createComment = async ({ postId, authorId, text }) => {
  return await sendRequest({
    request: { postId, authorId, text },
    queue: POST_SERVICE_QUEUES.createComment
  });
};


module.exports = Object.freeze({
  findPostById,
  findAllPostsILike,
  findAllPostsIDislike,
  findPostsByUserId,
  create,
  createComment,

  changeLikedPost,
  changeDislikedPost
});