'use strict';

import Customers from '../models/customers.model';

const add = (data) => {
  return Customers.create(data);
}

const update = (query, data) => {
  return Customers.findOneAndUpdate(query, data, { new: true }).exec();
};

const findOne = (data) => {
  return Customers.findOne(data).exec();
}

const find = (query, count) => {
  return Customers.aggregate([{$match: query},
    {
      $sort: {
        referenceID: 1
      }
    },
    {
      $limit: count
    }
  ]).exec();
}

const reports = (query) => {
  return Customers.aggregate([{$match: query},
    {
      $project: {
        "referenceID":1,
        "seller": 1,
        "address": 1,
        "appliedDate": 1,
        "transport":1,
        "amountPaid": 1
      }
    }
  ]).exec();
}

const count = (query) => {
  return Customers.count(query).exec();
}

export default  {
  add,
  update,
  findOne,
  find,
  count,
  reports
};
