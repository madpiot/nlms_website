'use strict';

import express from 'express';
import sellersController from '../controllers/sellers.controller';

let router = express.Router();

router.get('/sellers/get', sellersController.get);

router.get('/sellers/get/:sellerID', sellersController.getData);

router.post('/sellers/add', sellersController.add);

router.post('/sellers/search', sellersController.search);

router.put('/sellers/:sellerID', sellersController.update);

export default router;
