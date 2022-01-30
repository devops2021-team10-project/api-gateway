// Main
const express = require('express');
const authRouter = express.Router();

// Enums
const Role = require('../../user-service/utils/role');

// JSON request schema validators
const { authValidator } = require('../schemas/ajv');

// Formatters
const regularUserFormatter = require('../../user-service/formatters/user/regular-user.formatter');

// Util
const { handleError } = require('../../user-service/utils/error');
const { verifyJWT } = require('../utils/jwt');

// Middleware
const { authenticateUser } = require('../middleware/authenticateUser.middleware');
const { authorizeRoles } = require('../middleware/authorizeRoles.middleware');

// Services
const authService = require('../services/auth.service');
const userService = require('../../user-service/services/user.service');


authRouter.post(
  '/login',
  async (req, res, next) => {
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
});

authRouter.get(
  '/findByJWTHeader',
  authenticateUser(),
  authorizeRoles([Role.regular]),
  async (req, res, next) => {
    try {
      return res.status(200).json(regularUserFormatter.format(req.user));
    } catch(err) {
      handleError(err, res);
    }
});

authRouter.post(
  '/findByJWTValue',
  async (req, res, next) => {
    if (!(req.body.hasOwnProperty('jwt') && typeof req.body.jwt === 'string' && req.body.jwt.length > 5)) {
      return res.status(400).json({ msg: "Invalid token." });
    }
    const data = verifyJWT(req.body.jwt);
    const user = await userService.findUserById({ id: data.sub });
    if (!user) {
      return res.status(400).json({ msg: "Bad token. User not found." });
    }
    try {
      return res.status(200).json(regularUserFormatter.format(user));
    } catch(err) {
      handleError(err, res);
    }
});

module.exports = authRouter;