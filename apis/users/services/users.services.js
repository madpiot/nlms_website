'use strict';

import User from '../models/users.model';
import md5 from 'md5';
import _ from 'lodash';

const findOne = (data) => {
  if(data.password)
   data.password = md5(data.password);
  return User.findOne(data).select('-passsword').exec();
}

const find = (query) => {
  return User.find(query).select('-passsword').exec();
}

const create = (data) => {

  if(data.password){
   data.password = md5(data.password);
  }
  return User.create(data);
}

export default  {
  findOne,
  create,
  find
};
