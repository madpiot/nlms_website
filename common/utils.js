'use strict';

import config from '../config/config';
import jwt from 'jsonwebtoken';

import Promise from 'bluebird';

const generateJwtToken = (data, requestFrom) => {

  let secretCode = config.default.jwt.normal.secret;
  let expiresIn = config.default.jwt.normal.expiresIn;
  if(requestFrom == 'website')
    expiresIn = '1d';

  return jwt.sign({ data }, secretCode, { expiresIn: expiresIn });

};

const decodeJwtToken = (jwtToken) => {
  let secretCode = config.default.jwt.normal.secret;

  return new Promise((resolve, reject) => {
      jwt.verify(jwtToken, secretCode, (error, decodedData) => {
          if (!error) resolve(decodedData);
          else reject({ status: 'unauthorised', message: 'jwt expired' });
      });
  });
};

export {
    generateJwtToken,
    decodeJwtToken
};
