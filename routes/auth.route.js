
// Enums
const Role = require('../utils/userRoleEnum');

// JSON request schema validators
const { authValidator } = require('../schemas/ajv');

// Formatters
const regularUserFormatter = require('../formatters/user/regular-user.formatter');

// Util
const { handleError } = require('../utils/error');
const { verifyJWT } = require('../utils/jwt');

// Services
const authService = require('../services/auth.service');
const userServiceAPI = require('../service-apis/user.service-api');


const regularUserLogin = async (req, res, next) => {
  try {

    if (!authValidator.validateLogin(req.body)) {
      throw { status: 400, msg: "Bad login data." };
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

const adminUserLogin = async (req, res, next) => {
  try {

    if (!authValidator.validateLogin(req.body)) {
      throw { status: 400, msg: "Bad login data." };
    }

    const { accessToken, refreshToken } = await authService.login({
      username: req.body.username,
      password: req.body.password,
      role: Role.admin
    });

    return res.status(200).json({ accessToken: accessToken, refreshToken: refreshToken });
  } catch(err) {
    handleError(err, res);
  }
};

const agentUserLogin = async (req, res, next) => {
  try {

    if (!authValidator.validateLogin(req.body)) {
      throw { status: 400, msg: "Bad login data." };
    }

    const { accessToken, refreshToken } = await authService.login({
      username: req.body.username,
      password: req.body.password,
      role: Role.agent
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
      throw { status: 400, msg: "Invalid token." };
    }
    const data = verifyJWT(req.body.jwt);
    const serviceResponse = await userServiceAPI.findUserById({ id: data.sub });
    if (serviceResponse.isError) {
      throw { status: 400, msg: serviceResponse.error}
    }
    const user = serviceResponse.data;
    if (!user) {
      throw { status: 400, msg: "Bad token. User not found."}
    }
    return res.status(200).json(regularUserFormatter.format(user));
  } catch(err) {
    handleError(err, res);
  }
};

module.exports = Object.freeze({
  regularUserLogin,
  adminUserLogin,
  agentUserLogin,

  findByJWTHeader,
  findByJWTValue
});