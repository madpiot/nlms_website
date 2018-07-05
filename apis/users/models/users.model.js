'use strict';
import mongoose from 'mongoose';
import Promise from 'bluebird';
import mp5 from 'md5';

const Schema = mongoose.Schema;

mongoose.Promise = Promise;

const schema = new Schema({
    name: {
      type: String,
      required: true
    },
    mobile: String,
    username: {
        type: String,
        index: true,
        unique: true,
    },
    email: String,
    password: { type: String, select: false },
    userType: { type: String, default: 'customer' },
    signupDate: { type: Date, default: Date.now },
    updatedDate: { type: Date, default: Date.now },
    signupFrom: String,

    address: String
});

export default mongoose.model('users', schema);
