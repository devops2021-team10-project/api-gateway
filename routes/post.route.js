
// JSON request schema validators
const { postValidator } = require('../schemas/ajv');

// Utils
const { handleError } = require('./../utils/error');

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


module.exports = Object.freeze({
  findPostById,
  findPostsByUserId,
  findPostImageByPostId,
  create
});