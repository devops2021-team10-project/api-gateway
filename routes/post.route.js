
// JSON request schema validators
const { postValidator } = require('../schemas/ajv');

// Utils
const { handleError } = require('./../utils/error');
const { checkCondition } = require('../middleware/authorizeFollowing.middleware');

// Microservice calls
const postServiceAPI = require('../service-apis/post.service-api');


const findPostById = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    if (!postId) {
      throw { status: 400, msg: "Bad request, cannot get post" };
    }
    const serviceResponse = await postServiceAPI.findPostById({ postId: postId });
    if (serviceResponse.isError) {
      throw { status: 400, msg: serviceResponse.error };
    }
    const post = serviceResponse.data;

    await checkCondition({followerUserId: req.user?.id, followedUserId: post.authorUserId});

    return res.status(200).json(post);
  } catch(err) {
    handleError(err, res);
  }
};


const findPostsByUserId = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      throw { status: 400, msg: "Bad request, cannot get user" };
    }
    await checkCondition({ followerUserId: req.user?.id, followedUserId: req.params.userId });

    const serviceResponse = await postServiceAPI.findPostsByUserId({ userId: userId });
    if (serviceResponse.isError) {
      throw { status: 400, msg: serviceResponse.error };
    }
    const posts = serviceResponse.data;
    return res.status(200).json(posts);
  } catch(err) {
    handleError(err, res);
  }
};


const findPostImageByPostId = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    if (!postId) {
      throw { status: 400, msg: "Bad request, cannot get post" };
    }

    const serviceResponse = await postServiceAPI.findPostById({ postId: postId });
    if (serviceResponse.isError) {
      throw { status: 400, msg: serviceResponse.error };
    }
    const post = serviceResponse.data;

    await checkCondition({followerUserId: req.user?.id, followedUserId: post.authorUserId});

    const file = post.imageInfo.path;
    res.download(file);
  } catch(err) {
    handleError(err, res);
  }
};


const create = async (req, res, next) => {
  try {
    req.body = JSON.parse(JSON.stringify(req.body));
    if (!req.body.hasOwnProperty('postdata')) {
      throw { status: 400, msg: "No post data" }
    }
    const postData = JSON.parse(req.body["postdata"]);

    if (!postValidator.validateCreate(postData)) {
      throw { status: 400, msg: "Bad data."};
    }

    const serviceResponse = await postServiceAPI.create({
      authorUserId: req.user.id,
      postData: postData,
      imageInfo: req.file,
    });
    if (serviceResponse.isError) {
      throw { status: 400, msg: serviceResponse.error}
    }
    const insertedPost = serviceResponse.data;

    return res.status(200).json(insertedPost);
  } catch(err) {
    handleError(err, res);
  }
};

const createComment = async (req, res, next) => {
  try {
    if (!postValidator.validateCreateComment(req.body)) {
      throw { status: 400, msg: "Bad data." };
    }

    const serviceResponse1 = await postServiceAPI.findPostById({ postId: req.body.postId });
    if (serviceResponse1.isError) {
      throw { status: 400, msg: serviceResponse1.error };
    }
    const post = serviceResponse1.data;
    await checkCondition({followerUserId: req.user.id, followedUserId: post.authorUserId});

    const serviceResponse2 = await postServiceAPI.createComment({
      postId: req.body.postId,
      authorId: req.user.id,
      text: req.body.text
    });
    if (serviceResponse2.isError) {
      throw { status: 400, msg: serviceResponse2.error };
    }

    return res.status(200).json(serviceResponse2.data);

  } catch(err) {
    handleError(err, res);
  }
};


const changeLikedPost = async (req, res, next) => {
  try {
    if (!postValidator.validateChangeLikedPost(req.body)) {
      throw { status: 400, msg: "Bad data." };
    }

    const serviceResponse1 = await postServiceAPI.findPostById({ postId: req.body.toLikePostId });
    if (serviceResponse1.isError) {
      throw { status: 400, msg: serviceResponse1.error };
    }
    const post = serviceResponse1.data;

    await checkCondition({followerUserId: req.user.id, followedUserId: post.authorUserId});

    const serviceResponse2 = await postServiceAPI.changeLikedPost({
      userId: req.user.id,
      toLikePostId: req.body.toLikePostId,
      isLiked: req.body.isLiked
    });
    if (serviceResponse2.isError) {
      throw { status: 400, msg: serviceResponse1.error };
    }

    return res.status(200).json({});

  } catch(err) {
    handleError(err, res);
  }
};


const changeDislikedPost = async (req, res, next) => {
  try {
    if (!postValidator.validateChangeDislikedPost(req.body)) {
      throw { status: 400, msg: "Bad data." };
    }

    const serviceResponse1 = await postServiceAPI.findPostById({ postId: req.body.toDislikePostId });
    if (serviceResponse1.isError) {
      throw { status: 400, msg: serviceResponse1.error };
    }
    const post = serviceResponse1.data;

    await checkCondition({followerUserId: req.user.id, followedUserId: post.authorUserId});

    const serviceResponse2 = await postServiceAPI.changeDislikedPost({
      userId: req.user.id,
      toDislikePostId: req.body.toDislikePostId,
      isDisliked: req.body.isDisliked
    });
    if (serviceResponse2.isError) {
      throw { status: 400, msg: serviceResponse2.error };
    }

    return res.status(200).json({});

  } catch(err) {
    handleError(err, res);
  }
};



module.exports = Object.freeze({
  findPostById,
  findPostsByUserId,
  findPostImageByPostId,
  create,
  createComment,

  changeLikedPost,
  changeDislikedPost
});