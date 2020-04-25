import request      from 'supertest';
import { expect }   from 'chai'
import T            from '../Test';

export default () => {
    describe('test posting', () => {
        T.actions.create_post({ "content":"here is a sick post" }, false)
        T.actions.create_post({ "content":"here is a nice post" }, false)
        T.actions.create_post({ "content":"here is a cute post" }, true)

        describe('run tests on data', () => {
            it('should get both posts from the non-alt user', done => {
                request(T.app).get(`/users/${T.get('USER')._id}/posts`)
                .end((err, res) => {
                    expect(res.body.length).to.be.eq(2);
                    done(err);
                })
            })    

            it('should repost the alt users post', done => {
                request(T.app).post(`/users/${T.get('USER')._id}/posts/${T.get('POST', true)._id}/repost`)
                .expect(201)
                .end((err, res) => {
                    done(err);
                })
            })

            it('should repost the alt users post with a comment', done => {
                request(T.app).post(`/users/${T.get('USER')._id}/posts/${T.get('POST', true)._id}/repost`)
                .send({"content":"hey that's a pretty cool post!"})
                .set('Content-Type', 'application/json')
                .expect(201)
                .end((err, res) => {
                    done(err);
                })
            })

            it('should make alt user reply to user post', done => {
                request(T.app).post(`/users/${T.get('USER', true)._id}/posts/${T.get('POST')._id}/reply`)
                .send({"content":"this is a reply"})
                .set('Content-Type', 'application/json')
                .expect(201)
                .end((err, res) => {
                    T.set('REPLY', res.body, true)
                    done(err);
                })                
            })

            it('should make user reply to alt users reply', done => {
                request(T.app).post(`/users/${T.get('USER')._id}/posts/${T.get('REPLY', true)._id}/reply`)
                .send({"content":"this is a reply"})
                .set('Content-Type', 'application/json')
                .expect(201)
                .end((err, res) => {
                    T.set('REPLY', res.body)
                    done(err);
                })                
            })

            it('should make alt user reply to users reply', done => {
                request(T.app).post(`/users/${T.get('USER', true)._id}/posts/${T.get('REPLY')._id}/reply`)
                .send({"content":"this is a reply"})
                .set('Content-Type', 'application/json')
                .expect(201)
                .end((err, res) => {
                    T.set('REPLY', res.body, true)
                    done(err);
                })                
            })

            it('should make user heart alt users post', done => {
                request(T.app).post(`/users/${T.get('USER')._id}/posts/${T.get('POST', true)._id}/heart`)
                .set('Content-Type', 'application/json')
                .expect(201)
                .end((err, res) => {
                    done(err);
                })                
            })

            it('should get the alt users post & it have a heart', done => {
                request(T.app).get(`/users/${T.get('USER', true)._id}/posts/${T.get('POST', true)._id}`)
                .expect(200)
                .end((err, res) => {
                    console.log(res.body)
                    expect(res.body.hearts).to.be.eq(1);
                    done(err)
                })
            })
        })
    })
}