
// Services
const userServiceAPI = require("../service-apis/user.service-api");
const followingServiceAPI = require("../service-apis/following.service-api");


const checkCondition = async ({ followerUserId = null, followedUserId }) => {
  if (followerUserId === followedUserId) {
    return true;
  }

  const serviceResponse1 = await userServiceAPI.findUserById({id: followedUserId });
  if (serviceResponse1.isError) {
    throw { status: 400, msg: serviceResponse1.error };
  }
  const followedUser = serviceResponse1.data;

  if (followerUserId === null &&!followedUser.isPrivate) {
    return true;
  }

  const serviceResponse2 = await followingServiceAPI.findByUserIds({
    followerUserId: followerUserId,
    followedUserId: followedUserId,
  });
  if (serviceResponse2.isError) {
    throw { status: 400, msg: serviceResponse2.error };
  }
  const following1 = serviceResponse2.data;

  if (!following1 || !following1?.isApproved) {
    throw { status: 400, msg: "You cannot view this profile 1" };
  }

  const serviceResponse3 = await followingServiceAPI.findByUserIds({
    followerUserId: followedUserId,
    followedUserId: followerUserId,
  });
  if (serviceResponse3.isError) {
    throw { status: 400, msg: serviceResponse3.error };
  }
  const following2 = serviceResponse3.data;

  if (following2 && following2.isBlocked) {
    throw { status: 400, msg: "You cannot view this profile 1" };
  }

};


module.exports = Object.freeze({
  checkCondition
});