import request from "supertest";
import { describe, it } from "mocha";
import T from "./Test";

import test_users from "./integration-tests/users.test";
import test_posts from "./integration-tests/posts.test";
import test_recordables from "./integration-tests/recordables.test";
import test_devices from "./integration-tests/devices.test";
import test_api_keys from "./integration-tests/api_keys.test";

before((done) => {
  T.app.on("APP_STARTED", function () {
    done();
  });
});

describe("Integration testing", () => {
  it("Should clear all data from neo4j", (done) => {
    request(T.app)
      .post("/test/drop")
      .expect(200)
      .end((err, res) => done());
  });

  test_users();
  test_posts();
  test_recordables();
  test_devices();
  test_api_keys();
}).afterAll(() => T.finish());
