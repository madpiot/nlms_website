'use strict';
import mongoose from 'mongoose';
import Promise from 'bluebird';

const Schema = mongoose.Schema;

mongoose.Promise = Promise;

const schema = new Schema({
  //Basic Details
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
  appliedDate: String,
  amountPaid: Number,
  //Beneficiary Bank Details
  bank: {
    name: String,
    branch: String,
    ifsc: String,
    account: String
  },
  //Subsidy Details
  subsidy: {
    benificiaryAmount: Number,
    proceeding: {
      no: String,
      sNo: String
    },
    amount: Number
  },
  //Grounding Details
  grounding: {
    date: String,
    place: String
  },
  //Seller Details
  seller: {
    name: String,
    father: String,
    village: String,
    aadhaar: String,
    bank: {
      name: String,
      account: String,
      ifsc: String,
      chequeNo: String,
    },
    amount: Number
  },
  //Transport Details
  transport: {
    name: String, //transporterName
    vehicle: String,
    date: String,
    amount: Number
  },
  //Feed Cost Details
  feedCost: {
    quantity: Number,
    date: String,
    amount: Number
  },
  //Medicine
  medicine: {
    name: String,
    date: String,
    amount: Number
  },
  createdDate: {type: Date, default: Date.now }
});

export default mongoose.model('customers', schema);
