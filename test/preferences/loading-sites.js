const mocha = require('mocha')
const chai = require('chai')
const expect = chai.expect

const veriTokenMiddleware = require('../../utils/middleware/verifyToken')

describe('Auth Middleware', () => {
    const req = {
        headers: {
            authorization: null
        }
    }
    it('it should throw an error if no token is present in the headers', () => {
        expect(veriTokenMiddleware.bind(this, req, {}, () => { })).to.throw('No token found')
    })
    it('it should throw an invalid token if an expired or invalid token is present ', () => {
        req.headers.authorization = 'SomeXYZBullshit'
        expect(veriTokenMiddleware.bind(this, req, {}, () => { })).to.throw('Token either invalid or expired')
    })
})