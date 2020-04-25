import request      from 'supertest';
import { expect }   from 'chai'
import T            from '../Test';

export default () => {
    describe('test user routes', () => {
        T.actions.create_user({
            "username":"cass",
            "email":"test@mail.com",
            "password":"testpassword"
        }, false)

        T.actions.create_user({
            "username":"not cass",
            "email":"nottest@mail.com",
            "password":"nottestpassword"
        }, true)
        
        describe('run the tests', () => {
            it('should verify the user email', done => {
                request(T.app).get(`/auth/verify?email=${T.get('USER').email}&hash=nothing`)
                .end((err, res) => {
                    expect(res.status).to.be.eq(301);
                    done(err);
                })
            })   

            it('should log the user in', done => {
                request(T.app).post(`/users/login`)
                .send({
                    "email":"test@mail.com",
                    "password":"testpassword"
                })
                .expect(200)
                .end((err, res) => {
                    expect(res.header["set-cookie"]).to.not.be.undefined;
                    T.set('AUTH_COOKIE', res.header["set-cookie"][0]);
                    done(err);
                })
            })
        
        
            it('should verify the secondary user email', done => {
                request(T.app).get(`/auth/verify?email=${T.get('USER', true).email}&hash=nothing`)
                .expect(301)
                .end((err, res) => {
                    done(err);
                })
            })
        
            it('should get user by _id', done => {
                request(T.app).get(`/users/${T.get('USER')._id}`)
                .expect(200)
                .end((err, res) => {
                    expect(res.body._id).to.be.eq(T.get('USER')._id);
                    done(0);
                })
            })
        
            it('should get user by username', done => {
                request(T.app).get(`/users/u/${T.get('USER').username}`)
                .expect(200)
                .end((err, res) => {
                    expect(res.body._id).to.be.eq(T.get('USER')._id);
                    done(err);
                })
            })
        
            it('should update the user', done => {
                request(T.app).put(`/users/${T.get('USER')._id}`)
                .send({
                    "name": "cass w.",
                    "bio": "this is my bio, it's really cool 🌱🥰",
                    "location": "cardiff, uk"
                })
                .expect(200)
                .end((err, res) => {
                    expect(res.body.name).to.be.eq('cass w.');
                    T.set('USER', res.body)
                    done(err);
                })
            })
        
            it('should update the users avatar', done => {
                request(T.app).put(`/users/${T.get('USER')._id}/avatar`)
                .attach('avatar', `test/mock-data/avatar.jpg`)
                .expect(200)
                .end((err, res) => {
                    expect(res.body.avatar).to.not.be.undefined;
                    done(err);
                })
            })
        
            it('should follow the other user', done => {
                request(T.app).post(`/users/${T.get('USER')._id}/follow/${T.get('USER', true)._id}`)
                .expect(200)
                .end((err, res) => {
                    done(err);
                })
            })
        
            it('should get a list of followers', done => {
                request(T.app).get(`/users/${T.get('USER', true)._id}/followers`)
                .expect(200)
                .end((err, res) => {
                    expect(res.body.length).to.be.eq(1);
                    done(err);
                })
            })
        
            it('should un-follow the other user', done => {
                request(T.app).delete(`/users/${T.get('USER')._id}/follow/${T.get('USER', true)._id}`)
                .expect(200)
                .end((err, res) => {
                    done(err);
                })
            })
        
            it('should block the other user', done => {
                request(T.app).post(`/users/${T.get('USER')._id}/block/${T.get('USER', true)._id}`)
                .expect(200)
                .end((err, res) => {
                    done(err);
                })
            })
        
            it('should get a list of blocked users', done => {
                request(T.app).get(`/users/${T.get('USER')._id}/blocking`)
                .expect(200)
                .end((err, res) => {
                    expect(res.body.length).to.be.eq(1);
                    done(err);
                })
            })
        
            it('should un-block the other user', done => {
                request(T.app).delete(`/users/${T.get('USER')._id}/block/${T.get('USER', true)._id}`)
                .expect(200)
                .end((err, res) => {
                    done(err);
                })
            })
        
            // it('should log out the user', done => {
            //     request(T.app).post(`/users/${T.get('USER')._id}/logout`)
            // })
        
            it('should delete the secondary user', done => {
                request(T.app).delete(`/users/${T.get('USER', true)._id}`)
                .expect(200)
                .end((err, res) => done(err));
            })
        
            it('should only have one user in all users', done => {
                request(T.app).get('/users')
                .expect(200)
                .end((err, res) => {
                    expect(res.body.length).to.be.eq(1);
                    done(err);
                })
            })
        })

        T.actions.create_user({
            "username":"not cass",
            "email":"nottest@mail.com",
            "password":"nottestpassword"
        }, true)
    })    
}
