
const sendRequest = require('./genericRequest');

const USER_SERVICE_QUEUES = {
  noAuth_findUserByUsername:  "userService_noAuth_findUserByUsername",
  noAuth_findUserById:        "userService_noAuth_findUserById",
  noAuth_searchByName:        "userService_noAuth_searchByName",
  findUserById:               "userService_findUserById",
  registerRegularUser:        "userService_registerRegularUser",
  updateRegularUser:          "userService_updateRegularUser",
  resetPassword:              "userService_resetPassword",
  changeIsPrivate:            "userService_changeIsPrivate",
  changeIsTaggable:           "userService_changeIsTaggable",
  changeMutedProfile:         "userService_changeMutedProfile",
  changeBlockedProfile:       "userService_changeBlockedProfile",
  delete:                     "userService_delete"
};


const findUserByUsername = async ({ username }) => {
  return await sendRequest({
    request: {username},
    queue: USER_SERVICE_QUEUES.noAuth_findUserByUsername
  });
};



module.exports = Object.freeze({
  findUserByUsername
});