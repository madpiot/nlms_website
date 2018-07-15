'use strict';
import mongoose from 'mongoose';
import Promise from 'bluebird';

const Schema = mongoose.Schema;

mongoose.Promise = Promise;

const schema = new Schema({
  name: String,
  father: String,
  village: String,
  aadhaar: String,
  bank: {
    name: String,
    account: String,
    ifsc: String,
  },
  createdDate: {type: Date, default: Date.now }
});

export default mongoose.model('sellers', schema);
