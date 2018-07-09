'use strict';

import express from 'express';
import CustomersController from '../controllers/customers.controller';

let router = express.Router();

router.post('/customers/get', CustomersController.getAll);

router.post('/customers/add', CustomersController.add);

router.put('/customers/:userID', CustomersController.update);

//router.get('/customers/addmandal/:type', CustomersController.insertMandal);

router.get('/customers/:customerID', CustomersController.get);

router.post('/customers/search', CustomersController.search);

export default router;
