// Main
const express = require('express');
const authRouter = express.Router();

// Enums
const Role = require('../utils/userRoleEnum');

// JSON request schema validators
const { authValidator } = require('../schemas/ajv');

// Formatters
const regularUserFormatter = require('../formatters/user/regular-user.formatter');

// Util
const { handleError } = require('../../user-service/utils/error');
const { verifyJWT } = require('../utils/jwt');

// Services
const authService = require('../services/auth.service');
const userServiceAPI = require('../service-apis/user.service-api');


const regularUserLogin = async (req, res, next) => {
  try {

    if (!authValidator.validateLogin(req.body)) {
      throw "Bad data.";
    }

    const { accessToken, refreshToken } = await authService.login({
        username: req.body.username,
        password: req.body.password,
        role: Role.regular
      });

    return res.status(200).json({ accessToken: accessToken, refreshToken: refreshToken });
  } catch(err) {
      handleError(err, res);
  }
};

const findByJWTHeader = async (req, res, next) => {
  try {
    return res.status(200).json(regularUserFormatter.format(req.user));
  } catch(err) {
    handleError(err, res);
  }
};

const findByJWTValue = async (req, res, next) => {
  try {
    if (!(req.body.hasOwnProperty('jwt') && typeof req.body.jwt === 'string' && req.body.jwt.length > 5)) {
      return res.status(400).json({ msg: "Invalid token." });
    }
    const data = verifyJWT(req.body.jwt);
    const serviceResponse = await userServiceAPI.findUserById({ id: data.sub });
    if (serviceResponse.isError) {
      throw { status: 400, msg: serviceResponse.error}
    }
    const user = serviceResponse.data;
    if (!user) {
      return res.status(400).json({ msg: "Bad token. User not found." });
    }
    return res.status(200).json(regularUserFormatter.format(user));
  } catch(err) {
    handleError(err, res);
  }
};

module.exports = Object.freeze({
  regularUserLogin,
  findByJWTHeader,
  findByJWTValue
});