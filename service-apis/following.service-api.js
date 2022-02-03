const sendRequest = require('../msgBroker/genericRequest');


const FOLLOWING_SERVICE_QUEUES = {
  findByUserIds:                          "followingService_findByUserIds",
  findAllWhoIFollow:                      "followingService_findAllWhoIFollow",
  findAllWhoFollowMe:                     "followingService_findAllWhoFollowMe",
  findAllMyReceivedFollowRequests:        "followingService_findAllMyReceivedFollowRequests",

  follow:                                 "followingService_follow",
  unfollow:                               "followingService_unfollow",
  approveFollowing:                       "followingService_approveFollowing",

  mute:                                   "followingService_mute",
  unmute:                                 "followingService_unmute",
  block:                                  "followingService_block",
  unblock:                                "followingService_unblock",

  deleteFollowing:                        "followingService_deleteFollowing"
};


const findByUserIds = async ({ followerUserId, followedUserId }) => {
  return await sendRequest({
    request: { followerUserId, followedUserId },
    queue: FOLLOWING_SERVICE_QUEUES.findByUserIds
  });
};

const findAllWhoIFollow = async ({ followerUserId }) => {
  return await sendRequest({
    request: { followerUserId },
    queue: FOLLOWING_SERVICE_QUEUES.findAllWhoIFollow
  });
};

const findAllWhoFollowMe = async ({ followedUserId }) => {
  return await sendRequest({
    request: { followedUserId },
    queue: FOLLOWING_SERVICE_QUEUES.findAllWhoFollowMe
  });
};

const findAllMyReceivedFollowRequests = async ({ followedUserId }) => {
  return await sendRequest({
    request: { followedUserId },
    queue: FOLLOWING_SERVICE_QUEUES.findAllMyReceivedFollowRequests
  });
};

const follow = async ({ followerUserId, followedUserId }) => {
  return await sendRequest({
    request: { followerUserId, followedUserId },
    queue: FOLLOWING_SERVICE_QUEUES.follow
  });
};

const unfollow = async ({ followerUserId, followedUserId }) => {
  return await sendRequest({
    request: { followerUserId, followedUserId },
    queue: FOLLOWING_SERVICE_QUEUES.unfollow
  });
};

const approveFollowing = async ({ followerUserId, followedUserId }) => {
  return await sendRequest({
    request: { followerUserId, followedUserId },
    queue: FOLLOWING_SERVICE_QUEUES.approveFollowing
  });
};

const mute = async ({ followerUserId, followedUserId }) => {
  return await sendRequest({
    request: { followerUserId, followedUserId },
    queue: FOLLOWING_SERVICE_QUEUES.mute
  });
};

const unmute = async ({ followerUserId, followedUserId }) => {
  return await sendRequest({
    request: { followerUserId, followedUserId },
    queue: FOLLOWING_SERVICE_QUEUES.unmute
  });
};

const block = async ({ followerUserId, followedUserId }) => {
  return await sendRequest({
    request: { followerUserId, followedUserId },
    queue: FOLLOWING_SERVICE_QUEUES.block
  });
};

const unblock = async ({ followerUserId, followedUserId }) => {
  return await sendRequest({
    request: { followerUserId, followedUserId },
    queue: FOLLOWING_SERVICE_QUEUES.unblock
  });
};

const deleteFollowing = async ({ followerUserId, followedUserId }) => {
  return await sendRequest({
    request: { followerUserId, followedUserId },
    queue: FOLLOWING_SERVICE_QUEUES.deleteFollowing
  });
};

module.exports = Object.freeze({
  findByUserIds,
  findAllWhoIFollow,
  findAllWhoFollowMe,
  findAllMyReceivedFollowRequests,

  follow,
  unfollow,
  approveFollowing,

  mute,
  unmute,
  block,
  unblock,

  deleteFollowing
});