import { Stories } from "../stories";
import { expect } from "chai";
import { describe, it } from "mocha";
import { IUserStub } from "@cxss/interfaces";

export default describe(`Perform User CRUD tasks`, () => {
  let userData = {
    username: "cass_test",
    email: "testmail@mail.com",
    password: "testpassword",
  };

  it("Do CRUD stuff", async () => {
    await Stories.actions.common.setUp();
    let user = await Stories.actions.users.createUser(userData);
    await Stories.actions.users.loginUser(userData.email, userData.password);
  });
});
