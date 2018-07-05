'use strict';

import _ from 'lodash';

let isUser = {};

isUser.authenticated = (req, res, next) => {
  if(req.session.user) {
    next();
  } else
    res.redirect("/");
};

let requires = {};

requires.body = (req, res, next) => {
    if (!_.isEmpty(req.body)) next();
    else res.json({ success: false, message: 'Request Body is Empty. Please Provide Data.' });
};

export {
    isUser,
    requires
};
