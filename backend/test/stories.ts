import commonActions = require("./Actions/Common.actions");
import userActions = require("./Actions/Users.actions");
import authActions = require("./Actions/Auth.controller");

export const Stories = {
  log: true,
  actions: {
    common: commonActions,
    users: userActions,
    auth: authActions,
  },
  apiUrl: "http://localhost:3000",
};
