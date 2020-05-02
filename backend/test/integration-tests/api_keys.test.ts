import request      from 'supertest';
import { expect }   from 'chai'
import T            from '../Test';

export default () => {
    describe('test api keys routes', () => {
        it('should create an api key and assign it to a device', done => {
            request(T.app).post(`/users/${T.get('USER')._id}/devices/${T.get('DEVICE')._id}/keys`)
            .send({
                "key_name":"My Key",
                "recordable_type":"plant"
            })
            .expect(201)
            .end((err, res) => {
                console.log(res.body)
                expect(res.body.key_name).to.be.eq('My Key')
                T.set('API_KEY', res.body)
                done(err);
            })
        })
    })
}
