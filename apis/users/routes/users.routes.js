'use strict';

import express from 'express';
import UserController from '../controllers/users.controller';

let router = express.Router();

router.post('/login', UserController.login);

router.get('/users/logout', UserController.logout);

//
// router.post('/users/register', UserController.register);
//
// router.post('/users/add', UserController.addUser);
//
// router.get('/users', UserController.getAllUsers);

export default router;
