import commonActions = require("./Actions/Common.actions");
import userActions = require("./Actions/Users.actions");

export const Stories = {
  log: true,
  actions: {
    common: commonActions,
    users: userActions,
  },
  apiUrl: "http://localhost:3000",
};
