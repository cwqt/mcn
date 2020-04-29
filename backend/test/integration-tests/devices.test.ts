import request      from 'supertest';
import { expect }   from 'chai'
import T            from '../Test';

export default () => {
    describe('test device routes', () => {
        it('should create a device belonging to a user', done => {
            request(T.app).post(`/users/${T.get('USER')._id}/devices`)
            .send({
                "name":"wemos d1 mini",
                "hardware_model":"mcn-wd1m",
                "software_version":'1.0.2',
                "verified":false
            })
            .expect(201)
            .end((err, res) => {
                console.log('------>', res.body)
                expect(res.body.name).to.be.eq('wemos d1 mini')
                T.set('DEVICE', res.body)
                done(err);
            })
        })

        it('should assign the device to a recordable', done => {
            console.log(T.globals)
            request(T.app).post(`/users/${T.get('USER')._id}/devices/${T.get('DEVICE')._id}/assign/${T.get('PLANT')._id}`)
            .expect(201)
            .end((err, res) => {
                done(err);
            })
        })
    })
}
