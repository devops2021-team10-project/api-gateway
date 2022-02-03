// Utils
const { handleError } = require('./../utils/error');
const { checkCondition } = require('../middleware/authorizeFollowing.middleware');

// Microservice calls
const followingServiceAPI = require('../service-apis/following.service-api');


const findAllWhoIFollow = async (req, res, next) => {
  try {
    const serviceResponse = await followingServiceAPI.findAllWhoIFollow({
      followerUserId: req.user.id
    });
    if (serviceResponse.isError) {
      throw { status: 400, msg: serviceResponse.error };
    }
    return res.status(200).json(serviceResponse.data);
  } catch(err) {
    handleError(err, res);
  }
};

const findAllWhoFollowMe = async (req, res, next) => {
  try {
    const serviceResponse = await followingServiceAPI.findAllWhoFollowMe({
      followedUserId: req.user.id
    });
    if (serviceResponse.isError) {
      throw { status: 400, msg: serviceResponse.error };
    }
    return res.status(200).json(serviceResponse.data);
  } catch(err) {
    handleError(err, res);
  }
};

const findAllMyReceivedFollowRequests = async (req, res, next) => {
  try {
    const serviceResponse = await followingServiceAPI.findAllMyReceivedFollowRequests({
      followedUserId: req.user.id
    });
    if (serviceResponse.isError) {
      throw { status: 400, msg: serviceResponse.error };
    }
    return res.status(200).json(serviceResponse.data);
  } catch(err) {
    handleError(err, res);
  }
};

const follow = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      throw { status: 400, msg: "Bad request, cannot get user data" };
    }
    console.log("START follow");
    const serviceResponse = await followingServiceAPI.follow({
      followerUserId: req.user.id,
      followedUserId: userId,
    });
    if (serviceResponse.isError) {
      throw { status: 400, msg: serviceResponse.error };
    }
    console.log("END follow");
    return res.status(200).json({});
  } catch(err) {
    handleError(err, res);
  }
};

const unfollow = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      throw { status: 400, msg: "Bad request, cannot get user data" };
    }
    console.log("START unfollow");
    const serviceResponse = await followingServiceAPI.unfollow({
      followerUserId: req.user.id,
      followedUserId: userId,
    });
    if (serviceResponse.isError) {
      throw { status: 400, msg: serviceResponse.error };
    }
    console.log("END unfollow");
    return res.status(200).json({});
  } catch(err) {
    handleError(err, res);
  }
};

const approveFollowing = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      throw { status: 400, msg: "Bad request, cannot get user data" };
    }
    const serviceResponse = await followingServiceAPI.approveFollowing({
      followerUserId: userId,
      followedUserId: req.user.id,
    });
    if (serviceResponse.isError) {
      throw { status: 400, msg: serviceResponse.error };
    }
    return res.status(200).json({});
  } catch(err) {
    handleError(err, res);
  }
};

const mute = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      throw { status: 400, msg: "Bad request, cannot get user data" };
    }
    const serviceResponse = await followingServiceAPI.mute({
      followerUserId: req.user.id,
      followedUserId: userId,
    });
    if (serviceResponse.isError) {
      throw { status: 400, msg: serviceResponse.error };
    }
    return res.status(200).json({});
  } catch(err) {
    handleError(err, res);
  }
};

const unmute = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      throw { status: 400, msg: "Bad request, cannot get user data" };
    }
    const serviceResponse = await followingServiceAPI.unmute({
      followerUserId: req.user.id,
      followedUserId: userId,
    });
    if (serviceResponse.isError) {
      throw { status: 400, msg: serviceResponse.error };
    }
    return res.status(200).json({});
  } catch(err) {
    handleError(err, res);
  }
};

const block = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      throw { status: 400, msg: "Bad request, cannot get user data" };
    }
    const serviceResponse = await followingServiceAPI.block({
      followerUserId: req.user.id,
      followedUserId: userId,
    });
    if (serviceResponse.isError) {
      throw { status: 400, msg: serviceResponse.error };
    }
    return res.status(200).json({});
  } catch(err) {
    handleError(err, res);
  }
};


const unblock = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      throw { status: 400, msg: "Bad request, cannot get user data" };
    }
    const serviceResponse = await followingServiceAPI.unblock({
      followerUserId: req.user.id,
      followedUserId: userId,
    });
    if (serviceResponse.isError) {
      throw { status: 400, msg: serviceResponse.error };
    }
    return res.status(200).json({});
  } catch(err) {
    handleError(err, res);
  }
};

const deleteFollowing = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      throw { status: 400, msg: "Bad request, cannot get user data" };
    }
    const serviceResponse = await followingServiceAPI.deleteFollowing({
      followerUserId: req.user.id,
      followedUserId: userId,
    });
    if (serviceResponse.isError) {
      throw { status: 400, msg: serviceResponse.error };
    }
    return res.status(200).json({});
  } catch(err) {
    handleError(err, res);
  }
};

module.exports = Object.freeze({
  findAllWhoIFollow,
  findAllWhoFollowMe,
  findAllMyReceivedFollowRequests,

  follow,
  unfollow,
  approveFollowing,

  mute,
  unmute,
  block,
  unblock,

  deleteFollowing

})