// Main
const express = require('express');
const userRouter = express.Router();
const { differenceInYears, parse } = require('date-fns');

// Enums
const roleEnum = require('../utils/userRoleEnum');

// JSON request schema validators
const { userValidator } = require('../schemas/ajv');

// Utils
const { handleError } = require('./../utils/error');

// Middleware
const { authenticateUser } = require('../../api-gateway/middleware/authenticateUser.middleware');
const { authorizeRoles } = require('../../api-gateway/middleware/authorizeRoles.middleware');
const { authorizeFollowing } = require('../../api-gateway/middleware/authorizeFollowing.middleware');

// Microservice calls
const userService = require('./../service-apis/user.service-api');


// Find user by username (public)
userRouter.get(
  '/regular/public/byUsername/:username',
  async (req, res, next) => {
    try {
      const username = req.params.username;
      if (!username) {
        throw { status: 400, msg: "Bad request" }
      }
      const response = await userService.findUserByUsername({ username });

      if (response.isError) {
        throw { status: 400, msg: response.err}
      }

    } catch(err) {
      handleError(err, res);
    }
  });

module.exports = userRouter;