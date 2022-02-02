
const sendRequest = require('../msgBroker/genericRequest');

const USER_SERVICE_QUEUES = {
  findUserById:               "userService_findUserById",
  findUserByUsername:         "userService_findUserByUsername",
  searchByName:               "userService_searchByName",
  registerRegularUser:        "userService_registerRegularUser",
  updateRegularUser:          "userService_updateRegularUser",
  resetPassword:              "userService_resetPassword",
  changeIsPrivate:            "userService_changeIsPrivate",
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
  deleteUser
});