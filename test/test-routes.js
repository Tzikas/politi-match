"use strict";

// const chai = require('chai');
// const chaiHttp = require('chai-http');
// const faker = require('faker');
// const mongoose = require('mongoose');

// // const expect = chai.expect;

// const should = chai.should();

// const { User } = require('../app/models/user');

// chai.use(chaiHttp);


const should = require("should");
const mongoose = require('mongoose');
const User = require("../app/models/user.js");

describe('User', () => {

    before((done) => {
        const db = mongoose.connect('mongodb://localhost/test');
        done();
    });

    after((done) => {
        mongoose.connection.close();
        done();
    });

    beforeEach( (done) => {
        var user = new User({
            state: 'TXandMA'
        });

        user.save((error) => {
            if (error) console.log('error' + error.message);
            else console.log('no error');
            done();
        });
    });

    it('find a user by username', (done) => {
        User.findOne({ state: 'TXandMA' }, (err, account) => {
            account.state.should.eql('TXandMA');
            console.log("   username: ", account.username);
            done();
        });
    });

    afterEach((done) => {
        User.remove({}, () => {
            done();
        });
     });

});