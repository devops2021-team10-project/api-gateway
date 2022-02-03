

// Utils
const { handleError } = require('../utils/error');
const { verifyJWT } = require('../utils/jwt');

// Services
const userServiceAPI = require('../service-apis/user.service-api');

const checkCondition = async ({ req }) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    throw { status: 400, msg: "No token header." };
  }

  const jwtToken = authHeader && authHeader.split(' ')[1]
  if (!jwtToken) {
    throw { status: 400, msg: "Bad token format." };
  }

  const data = verifyJWT(jwtToken);
  const serviceResponse = await userServiceAPI.findUserById({ id: data.sub });
  if (serviceResponse.isError) {
    throw { status: 400, msg: serviceResponse.error}
  }
  const user = serviceResponse.data;
  if (!user) {
    throw { status: 400, msg: "Bad token - user not found." };
  }
  return user;
};


const authenticateUser = ({ passTheError } = {passTheError: false}) => {
    return async (req, res, next) => {
      try {
        req.user = await checkCondition({ req });
        next();
      } catch (err) {
        if (!passTheError) {
          return handleError(err, res);
        }
        next();
      }
    }
}

module.exports = Object.freeze({
  checkCondition,
  authenticateUser
});