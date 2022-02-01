
const sendRequest = require('../msgBroker/genericRequest');

const USER_SERVICE_QUEUES = {
  findUserById:               "userService_findUserById",
  findUserByUsername:         "userService_findUserByUsername",
  searchByName:               "userService_searchByName",
  registerRegularUser:        "userService_registerRegularUser",
  updateRegularUser:          "userService_updateRegularUser",
  resetPassword:              "userService_resetPassword",
  changeIsPrivate:            "userService_changeIsPrivate",
  changeIsTaggable:           "userService_changeIsTaggable",
  changeMutedProfile:         "userService_changeMutedProfile",
  changeBlockedProfile:       "userService_changeBlockedProfile",
  delete:                     "userService_delete"
};


const findUserById = async ({ id }) => {
  return await sendRequest({
    request: {id},
    queue: USER_SERVICE_QUEUES.findUserById
  });
};

const findUserByUsername = async ({ username }) => {
  return await sendRequest({
    request: { username },
    queue: USER_SERVICE_QUEUES.findUserByUsername
  });
};

const searchByName = async ({ name }) => {
  return await sendRequest({
    request: { name },
    queue: USER_SERVICE_QUEUES.searchByName
  });
};

const registerRegularUser = async ({ userData }) => {
  return await sendRequest({
    request: { userData },
    queue: USER_SERVICE_QUEUES.registerRegularUser
  });
};

const updateRegularUser = async ({ userId, userData }) => {
  return await sendRequest({
    request: { userId, userData },
    queue: USER_SERVICE_QUEUES.updateRegularUser
  });
};

const resetPassword = async ({ userId, oldPassword, newPassword }) => {
  return await sendRequest({
    request: { userId, oldPassword, newPassword },
    queue: USER_SERVICE_QUEUES.resetPassword
  });
};

const changeIsPrivate = async ({ userId, value }) => {
  return await sendRequest({
    request: { userId, value },
    queue: USER_SERVICE_QUEUES.changeIsPrivate
  });
};

const changeIsTaggable = async ({ userId, value }) => {
  return await sendRequest({
    request: { userId, value },
    queue: USER_SERVICE_QUEUES.changeIsTaggable
  });
};

const changeMutedProfile = async ({ id, toMuteUserId, isMuted }) => {
  return await sendRequest({
    request: { id, toMuteUserId, isMuted },
    queue: USER_SERVICE_QUEUES.changeMutedProfile
  });
};

const changeBlockedProfile = async ({ id, toBlockUserId, isBlocked }) => {
  return await sendRequest({
    request: { id, toBlockUserId, isBlocked },
    queue: USER_SERVICE_QUEUES.changeBlockedProfile
  });
};


const deleteUser = async ({ id }) => {
  return await sendRequest({
    request: { id },
    queue: USER_SERVICE_QUEUES.delete
  });
};




module.exports = Object.freeze({
  findUserById,
  findUserByUsername,
  searchByName,
  registerRegularUser,
  updateRegularUser,
  resetPassword,
  changeIsPrivate,
  changeIsTaggable,
  changeMutedProfile,
  changeBlockedProfile,
  deleteUser
});