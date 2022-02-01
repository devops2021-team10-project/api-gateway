
// Services
const userServiceAPI = require("../service-apis/user.service-api");
const followingServiceAPI = require("../service-apis/following.service-api");


const checkCondition = async ({ followerUserId, followedUserId }) => {
  const serviceResponse1 = userServiceAPI.findUserById({id: followedUserId });
  if (serviceResponse1.isError) {
    throw { status: 400, msg: serviceResponse1.error };
  }
  const followedUser = serviceResponse1.data;


  const serviceResponse2 = await followingServiceAPI.findByUserIds({
    followerUserId: followerUserId,
    followedUserId: followedUserId,
  });
  if (serviceResponse2.isError) {
    throw { status: 400, msg: serviceResponse2.error };
  }
  const following = serviceResponse2.data;


  if (!following || followedUser.isPrivate && !following?.isApproved) {
    throw { status: 400, msg: "You do not have permission to access to this resource. - authorizeFollowing." };
  }
};


module.exports = Object.freeze({
  checkCondition
});