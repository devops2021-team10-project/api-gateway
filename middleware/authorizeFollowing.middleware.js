
// Utils
const { handleError } = require('../../user-service/utils/error');

// Services
const userService = require("../../user-service/services/user.service");
const followingService = require("../service-apis/following.service-api");


const checkCondition = async (req) => {
  const followedUser = userService.findUserById({id: req.params.followedUserId });
  const following = await followingService.findByUserIds({
    followerUserId: req.params.followerUserId,
    followedUserId: req.params.followedUserId,
  });
  if (followedUser.isPrivate) {
    if (!(req.user?.id === req.params.followerUserId && following?.isApproved)) {
      throw "You do not have permission to access to this resource. - authFollowing.";
    }
  }
};

const authorizeFollowing = () => {
  return [
    async (req, res, next) => {
      try {
        await checkCondition(req);
        next();
      } catch (err) {
        return handleError(err, res);
      }
    }
  ];
}

module.exports = Object.freeze({
  checkCondition,
  authorizeFollowing
});