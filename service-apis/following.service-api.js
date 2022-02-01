const sendRequest = require('../msgBroker/genericRequest');


const FOLLOWING_SERVICE_QUEUES = {
  findByUserIds:                          "followingService_findByUserIds",
  findAllWhoIFollow:                      "followingService_findAllWhoIFollow",
  findAllWhoFollowMe:                     "followingService_findAllWhoFollowMe",
  findAllMyReceivedFollowRequests:        "followingService_findAllMyReceivedFollowRequests",
  follow:                                 "followingService_follow",
  unfollow:                               "followingService_unfollow",
  approveFollowing:                       "followingService_approveFollowing"
};


const findByUserIds = async ({ followerUserId, followedUserId }) => {
  return await sendRequest({
    request: { followerUserId, followedUserId },
    queue: FOLLOWING_SERVICE_QUEUES.findByUserIds
  });
};


module.exports = Object.freeze({
  findByUserIds
});