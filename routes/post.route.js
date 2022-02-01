
// JSON request schema validators
const { postValidator } = require('../schemas/ajv');

// Utils
const { handleError } = require('./../utils/error');

// Microservice calls
const postServiceAPI = require('../service-apis/post.service-api');


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
  create
});