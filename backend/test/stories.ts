import commonActions = require("./Actions/Common.actions");
import userActions = require("./Actions/Users.actions");
import authActions = require("./Actions/Auth.actions");
import orgActions = require("./Actions/Orgs.actions");
import deviceActions = require("./Actions/Device.actions");

export const Stories = {
  log: true,
  actions: {
    common: commonActions,
    users: userActions,
    orgs: orgActions,
    devices: deviceActions,
    auth: authActions,
  },
  apiUrl: "http://localhost:3000",
  activeSession: null as null | string,
};
