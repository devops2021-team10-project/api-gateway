const express = require('express');
const router = express.Router();

const { handleError } = require('./../utils/error');
const authServiceAPI = require('./../service-apis/auth.service-api');


router.post(
  '/regular-user/login', 
  async (req, res, next) => {
    try {
        const { accessToken, refreshToken } = 
          await authServiceAPI.regularUserLogin({ 
            username: req.body.username,
            password: req.body.password,
          });

        return res.status(200).json({ accessToken: accessToken, refreshToken: refreshToken });
    } catch(err) {
        handleError(err, res);
    }
});

router.get(
  '/regular-user/get-auth', 
  async (req, res, next) => {
    try {
      const authHeader = req.headers['authorization'];
      const jwtToken = authHeader && authHeader.split(' ')[1]
      const user = await authServiceAPI.getAuth({ jwt: jwtToken });

      return res.status(200).json(user);
    } catch(err) {
      handleError(err, res);
    }
});


module.exports = router;