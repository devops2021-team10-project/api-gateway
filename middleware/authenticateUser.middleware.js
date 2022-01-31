

// Utils
const { handleError } = require('../../user-service/utils/error');
const { verifyJWT } = require('../utils/jwt');

// Services
const userServiceAPI = require('../service-apis/user.service-api');

const checkCondition = async ({ req }) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    throw "Bad token.";
  }

  const jwtToken = authHeader && authHeader.split(' ')[1]
  if (!jwtToken) {
    throw "Bad token.";
  }

  const data = verifyJWT(jwtToken);
  const serviceResponse = await userServiceAPI.findUserById({ id: data.sub });
  const user = serviceResponse.data;
  if (!user) {
   throw "Bad token. User not found.";
  }
  return user;
};


const authenticateUser = () => {
    return async (req, res, next) => {
      try {
        req.user = await checkCondition({ req });
        next();
      } catch (err) {
          return handleError(err, res);
      }
    }
}

module.exports = Object.freeze({
  checkCondition,
  authenticateUser
});