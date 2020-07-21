import { Stories } from "../stories";
import { expect } from "chai";
import { describe, it } from "mocha";
import { IUserStub, NodeType } from "@cxss/interfaces";

export default describe(`Perform User CRUD tasks`, () => {
  let orgData = {
    name: "daughter.systems",
  };

  let userData = {
    username: "cass_test",
    email: "testmail@mail.com",
    password: "testpassword",
  };

  let deviceData = {
    hardware_model: "mcn_wemos_d1_mini",
    name: "my awsome device",
  };

  it("Do CRUD stuff", async () => {
    await Stories.actions.common.setUp();
    let user = await Stories.actions.users.createUser(userData);
    await Stories.actions.auth.verifyUserEmail(userData.email);
    await Stories.actions.users.loginUser(userData.email, userData.password);

    let org = await Stories.actions.orgs.createOrg(orgData);
    let device = await Stories.actions.devices.createDevice(deviceData);

    await Stories.actions.orgs.addNodeToOrg(org, NodeType.Device, device);
  }).timeout(2000000);
}).timeout(2000000);
