const axios = require('axios');
const Role = require('../utils/userRoleEnum');


const regularUserLogin = async ({
    username,
    password,
 } = {}) => {
    const response = await axios.post(
      'http://localhost:5001/user-service-api/auth/regular-user/login', 
      { username, password }
    );

    if (response.status !== 200) {
      throw response.data
    }
    return { ...response.data };
 };

 const getAuth = async ({
  jwt
  } = {}) => {
  const response = await axios.post(
    'http://localhost:5001/user-service-api/auth/regular-user/auth-jwt',
    { jwt }
  );

  if (response.status !== 200) {
    throw response.data
  }
  return { ...response.data };
};

module.exports = Object.freeze({
  regularUserLogin,
  getAuth
});