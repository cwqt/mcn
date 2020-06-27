import T from "./Test";
import request from "supertest";
import { describe, it } from "mocha";
import { expect } from "chai";
let actions = {} as any;

actions.create_user = (data: any, asAlt: boolean) => {
  describe("create a user", () => {
    it("should create a user", (done) => {
      request(T.app)
        .post("/users")
        .send(data)
        .set("Content-Type", "application/json")
        .expect(201)
        .end((err, res) => {
          T.set("USER", res.body, asAlt);
          done(err);
        });
    });
  });
};

actions.delete_user = (data: any, asAlt: boolean) => {
  describe("delete a user", () => {
    it("should delete a user", (done) => {});
  });
};

actions.create_post = (data: any, asAlt: true) => {
  describe("create a post", () => {
    it("should create a post", (done) => {
      request(T.app)
        .post(`/users/${T.get("USER", asAlt)._id}/posts`)
        .send(data)
        .set("Content-Type", "application/json")
        .expect(201)
        .end((err, res) => {
          expect(res.body.content).to.be.eq(data.content);
          T.set("POST", res.body, asAlt);
          done(err);
        });
    });
  });
};

export default actions;
