'use strict';

import Sellers from '../models/sellers.model';

const add = (data) => {
  return Sellers.create(data);
}

const update = (query, data) => {
  return Sellers.findOneAndUpdate(query, data, { new: true }).exec();
};

const findOne = (data) => {
  return Sellers.findOne(data).exec();
}

const find = (query, count) => {
  return Sellers.aggregate([{$match: query}
  ]).exec();
}

const count = (query) => {
  return Sellers.count(query).exec();
}

export default  {
  add,
  update,
  findOne,
  find,
  count
};
