'use strict';
import mongoose from 'mongoose';
import Promise from 'bluebird';

const Schema = mongoose.Schema;

mongoose.Promise = Promise;

const schema = new Schema({
  referenceID: {unique: true, type: Number},
  name: String,
  father: String,
  aadhaar: Number,
  mobile: Number,
  address: {
    village: String,
    mandal: String,
    district: String
  },
  gender: String, //male, female
  caste: String,
  income: {type: Number, default: 0},
  disability: {type: Boolean, default: false},
  bank: {
    name: String,
    ifsc: String,
    account: String
  },
  appliedDate: String,
  createdDate: {type: Date, default: Date.now }
});

export default mongoose.model('customers', schema);
