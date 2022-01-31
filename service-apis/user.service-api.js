
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




module.exports = Object.freeze({
  findUserById,
  findUserByUsername

});