import request from "supertest";
import { expect } from "chai";
import T from "../Test";

export default () => {
  describe("test recordable routes", () => {
    it("should create a plant belonging to a user", (done) => {
      request(T.app)
        .post(`/users/${T.get("USER")._id}/plants`)
        .send({
          name: "super cool cactus",
          species: "cactus",
        })
        .expect(201)
        .end((err, res) => {
          expect(res.body.name).to.be.eq("super cool cactus");
          T.set("PLANT", res.body);
          done(err);
        });
    });

    // it('should update the plant', done => {
    //     request(T.app).put(`/users/${T.get('USER')._id}/plants/${T.get('PLANT')._id}`)
    //     .send({
    //         "name": "super cool moop",
    //         "recording": ["moisture"],
    //         "species": "hydromalis gigas",
    //         "image": "http://somes3link.com/image.jpg",
    //         "host_url": "http://192.168.0.42:3000",
    //         "feed_url": "http://192.168.0.42:3001",
    //         "parameters": {
    //             "temperature": {"upper":20,"avg":15,"lower":5}
    //         },
    //     })
    //     .set('Content-Type', 'application/json')
    //     .expect(200)
    //     .end((err, res) => {
    //         expect(res.body.name).to.be.eq('super cool moop')
    //         done(err);
    //     })
    // })
  });
};
