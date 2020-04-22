import request          from 'supertest';
import { expect }       from 'chai';
import { describe, it } from 'mocha';
const { app, exit } = require('../lib/index');

let USER_ID:string;
let ALT_USER_ID:string;
let AUTH_COOKIE:string;

describe('integration tests', () => {
    describe('set up', () => {
        it('should clear all data from neo4j', done => {
            request(app).post('/test/drop')
            .expect(200)
            .end((err, res) => {
                done()
            })
        })    
    })

    describe('test user routes', () => {
        it('should create a user', done => {
            request(app).post('/users')
            .send({
                "username":"cass",
                "email":"test@mail.com",
                "password":"testpassword"
            })
            .expect(201)
            .end((err, res) => {
                expect(res.body.username).to.be.eq('cass');
                expect(res.body.verified).to.be.false;
                expect(res.body.new_user).to.be.true;
                USER_ID = res.body._id;
                done();
            })
        })

        it('should verify the user email', done => {
            request(app).get('/auth/verify?email=test@mail.com&hash=nothing')
            .end((err, res) => {
                expect(res.status).to.be.eq(301);
                done();
            })
        })

        it('should log the user in', done => {
            request(app).post(`/users/login`)
            .send({
                "email":"test@mail.com",
                "password":"testpassword"
            })
            .expect(200)
            .end((err, res) => {
                expect(res.header["set-cookie"]).to.not.be.undefined;
                AUTH_COOKIE = res.header["set-cookie"][0];
                done();
            })
        })

        it('should create a secondary user', done => {
            request(app).post('/users')
            .send({
                "username":"not cass",
                "email":"nottest@mail.com",
                "password":"nottestpassword"
            })
            .expect(201)
            .end((err, res) => {
                ALT_USER_ID = res.body._id;
                done();
            })
        })

        it('should verify the secondary user email', done => {
            request(app).get('/auth/verify?email=nottest@mail.com&hash=nothing')
            .expect(301)
            .end((err, res) => {
                done();
            })
        })

        it('should get user by _id', done => {
            request(app).get(`/users/${USER_ID}`)
            .expect(200)
            .end((err, res) => {
                expect(res.body._id).to.be.eq(USER_ID);
                done(0);
            })
        })

        it('should get user by username', done => {
            request(app).get(`/users/u/cass`)
            .expect(200)
            .end((err, res) => {
                expect(res.body._id).to.be.eq(USER_ID);
                done();
            })
        })

        it('should update the user', done => {
            request(app).put(`/users/${USER_ID}`)
            .send({
                "name": "cass w.",
                "bio": "this is my bio, it's really cool 🌱🥰",
                "location": "cardiff, uk"
            })
            .expect(200)
            .end((err, res) => {
                expect(res.body.name).to.be.eq('cass w.');
                done();
            })
        })

        it('should update the users avatar', done => {
            request(app).put(`/users/${USER_ID}/avatar`)
            .attach('avatar', `test/mock-data/avatar.jpg`)
            .expect(200)
            .end((err, res) => {
                expect(res.body.avatar).to.not.be.undefined;
                done();
            })
        })

        it('should follow the other user', done => {
            request(app).post(`/users/${USER_ID}/follow/${ALT_USER_ID}`)
            .expect(200)
            .end((err, res) => {
                done();
            })
        })

        // it('should get a list of followers', done => {
        //     request(app).get(`/users/${USER_ID}/followers`)
        //     .expect(200)
        //     .end((err, res) => {
        //         expect(res.body.length).to.be.eq(1);
        //         done();
        //     })
        // })

        it('should un-follow the other user', done => {
            request(app).delete(`/users/${USER_ID}/follow/${ALT_USER_ID}`)
            .expect(200)
            .end((err, res) => {
                done();
            })
        })

        it('should block the other user', done => {
            request(app).post(`/users/${USER_ID}/block/${ALT_USER_ID}`)
            .expect(200)
            .end((err, res) => {
                done();
            })
        })

        // it('should get a list of blocked users', done => {
        //     request(app).get(`/users/${USER_ID}/blocked`)
        //     .expect(200)
        //     .end((err, res) => {
        //         expect(res.body.length).to.be.eq(1);
        //         done();
        //     })
        // })

        it('should un-block the other user', done => {
            request(app).delete(`/users/${USER_ID}/block/${ALT_USER_ID}`)
            .expect(200)
            .end((err, res) => {
                done();
            })
        })

        // it('should log out the user', done => {
        //     request(app).post(`/users/${USER_ID}/logout`)
        // })

        it('should delete the secondary user', done => {
            request(app).delete(`/users/${USER_ID}`)
            .expect(200)
            .end((err, res) => done());
        })

        it('should only have one user in all users', done => {
            request(app).get('/users')
            .expect(200)
            .end((err, res) => {
                expect(res.body.length).to.be.eq(1);
                done();
            })
        })
    })
}).afterAll(() => {
    console.log('USER_ID    :', USER_ID)
    console.log('ALT_USER_ID:', ALT_USER_ID)
    console.log('AUTH_COOKIE:', AUTH_COOKIE)
    exit()
})