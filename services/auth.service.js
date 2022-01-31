
// Utils
const { issueJWT } = require('../utils/jwt');
const passwordUtils = require('../../user-service/utils/password');

// DB access
const userServiceAPI = require('../service-apis/user.service-api');


const login = async ({
    username,
    password,
    role
} = {}) => {
  const serviceResponse = await userServiceAPI.findUserByUsername({ username });
  const user = serviceResponse.data;
  if (!user) {
    throw { status: 400, msg: "Bad credentials 1."};
  }
  if (user.role !== role) {
    throw { status: 400, msg: "Bad credentials 2."};
  }
  const isValid = passwordUtils.validPassword({ password, hash: user.passwordHash, salt: user.passwordSalt });
  if(!isValid) {
    throw { status: 400, msg: "Bad credentials 3."};
  }
  if(user.isBlocked === true) {
    throw { status: 400, msg:"Your account is blocked by administrator" };
  }
  const accessToken = issueJWT('access', user.id);
  const refreshToken = issueJWT('refresh', user.id);

  return { accessToken: accessToken.token, refreshToken: refreshToken.token };
}

module.exports = Object.freeze({
  login
});