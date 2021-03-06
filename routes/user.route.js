// Main
const { differenceInYears, parse } = require('date-fns');

// JSON request schema validators
const { userValidator } = require('../schemas/ajv');

// Formatters
const regularUserFormatter = require('../formatters/user/regular-user.formatter');
const publicRegularUserFormatter = require("../formatters/user/regular-user.formatter");

// Utils
const { handleError } = require('./../utils/error');

// Microservice calls
const userServiceAPI = require('../service-apis/user.service-api');
const followingServiceAPI = require('../service-apis/following.service-api');

const incorporateFollowingData = async ({ operatorUserId, user }) => {
  const serviceResponse = await followingServiceAPI.findByUserIds({
    followerUserId: operatorUserId,
    followedUserId: user.id
  });
  if (serviceResponse.isError) {
    throw { status: 400, msg: serviceResponse.error}
  }
  user.followingData = serviceResponse.data;
}

// Find user by username (public)
const findPublicUserByUsername = async (req, res, next) => {
  try {
    const username = req.params.username;
    if (!username) {
      throw { status: 400, msg: "Bad request" };
    }
    const serviceResponse = await userServiceAPI.findUserByUsername({ username });
    if (serviceResponse.isError) {
      throw { status: 400, msg: serviceResponse.error}
    }
    const user = serviceResponse.data;
    if (!user) {
      throw { status: 400, msg: "User with given username does not exist." };
    }

    const retData = publicRegularUserFormatter.format(user);
    if (req.user) {
      await incorporateFollowingData({
        operatorUserId: req.user.id,
        user: retData
      })
    }

    return res.status(200).json(retData);
  } catch(err) {
    handleError(err, res);
  }
};

// Find user by username (public)
const findPublicUserById = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      throw { status: 400, msg: "Bad request" };
    }
    const serviceResponse = await userServiceAPI.findUserById({ id: userId });
    if (serviceResponse.isError) {
      throw { status: 400, msg: serviceResponse.error};
    }
    const user = serviceResponse.data;
    if (!user) {
      throw { status: 400, msg: "User with given id does not exist." };
    }
    const retData = publicRegularUserFormatter.format(user);
    if (req.user) {
      await incorporateFollowingData({
        operatorUserId: req.user.id,
        user: retData
      })
    }
    return res.status(200).json(retData);
  } catch(err) {
    handleError(err, res);
  }
};

// Search users by name (public)
const searchPublicUsersByName = async (req, res, next) => {
  try {
    const name = req.params.name;
    if (!name) {
      throw { status: 400, msg: "Bad request." };
    }

    const serviceResponse = await userServiceAPI.searchByName({ name });
    if (serviceResponse.isError) {
      throw { status: 400, msg: serviceResponse.error}
    }
    const users = serviceResponse.data;
    if (!users) {
      return res.status(200).json([]);
    }
    return res.status(200).json(users.map((user) => publicRegularUserFormatter.format(user)));
  } catch(err) {
    handleError(err, res);
  }
};


// Create new user (public)
const registerRegularUser = async (req, res, next) => {
  try {
    if (!userValidator.validateCreate(req.body)) {
      throw { status: 400, msg: "Bad data." };
    }
    // Check age
    try {
      const birthday = parse(req.body.birthday, 'dd.MM.yyyy.', new Date());
      const age = differenceInYears(new Date(), birthday);
      if (age < 13) {
        throw { status: 400, msg: "You are under legal age to use social media platform." };
      }
    } catch (err) {
      throw { status: 400, msg: "Bad date format." };
    }

    const serviceResponse = await userServiceAPI.registerRegularUser({ userData: req.body });
    if (serviceResponse.isError) {
      throw { status: 400, msg: serviceResponse.error };
    }

    const insertedUser = serviceResponse.data;
    return res.status(200).json(regularUserFormatter.format(insertedUser));
  } catch(err) {
    handleError(err, res);
  }
};


// Update regular user
const updateRegularUser = async (req, res, next) => {
  try {
    if (!userValidator.validateUpdate(req.body)) {
      throw { status: 400, msg: "Bad data." };
    }

    // Check age
    try {
      const birthday = parse(req.body.birthday, 'dd.MM.yyyy.', new Date());
      const age = differenceInYears(new Date(), birthday);
      if (age < 13) {
        throw { status: 400, msg: "You are under legal age to use social media platform." };
      }
    } catch (err) {
      throw { status: 400, msg: "Bad date format." };
    }

    const serviceResponse = await userServiceAPI.updateRegularUser({ userId: req.user.id, userData: req.body });
    if (serviceResponse.isError) {
      throw { status: 400, msg: serviceResponse.error}
    }
    const updatedUser = serviceResponse.data;
    return res.status(200).json(regularUserFormatter.format(updatedUser));
  } catch(err) {
    handleError(err, res);
  }
};


// Reset user password
const resetPassword = async (req, res, next) => {
  try {
    if (!userValidator.validatePasswordReset(req.body)) {
      throw { status: 400, msg: "Bad data." };
    }
    const serviceResponse = await userServiceAPI.resetPassword({
      userId: req.user.id,
      oldPassword: req.body.oldPassword,
      newPassword: req.body.newPassword
    });
    if (serviceResponse.isError) {
      throw { status: 400, msg: serviceResponse.error}
    }
    return res.status(200).json({});
  } catch(err) {
    handleError(err, res);
  }
};


// Change IsPrivate value
const changeIsPrivate = async (req, res, next) => {
  try {
    if (!userValidator.validateChangeIsPrivate(req.body)) {
      throw { status: 400, msg: "Bad data." };
    }
    const serviceResponse = await userServiceAPI.changeIsPrivate({
      userId: req.user.id,
      value: req.body.isPrivate,
    });
    if (serviceResponse.isError) {
      throw { status: 400, msg: serviceResponse.error}
    }
    return res.status(200).json({});
  } catch(err) {
    handleError(err, res);
  }
};


// Delete user
const deleteRegularUser = async (req, res, next) => {
  try {
    const serviceResponse = await userServiceAPI.deleteUser({
      id: req.user.id
    });
    if (serviceResponse.isError) {
      throw { status: 400, msg: serviceResponse.error}
    }
    return res.status(200).json({});
  } catch(err) {
    handleError(err, res);
  }
};

module.exports = Object.freeze({
  findPublicUserByUsername,
  findPublicUserById,
  searchPublicUsersByName,
  registerRegularUser,
  updateRegularUser,
  resetPassword,
  changeIsPrivate,
  deleteRegularUser
})