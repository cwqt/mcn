import request          from 'supertest';
import { expect }       from 'chai';
import { describe, it } from 'mocha';
const { app, exit } = require('../lib/index');

describe('integration tests', () => {
    it('should clear all data from neo4j', done => {
        request(app).post('/test/drop')
        .end((err, res) => {
            expect(res.status).to.be.ok;
            done()
        })
    })
}).afterAll(() => {
    exit()
})