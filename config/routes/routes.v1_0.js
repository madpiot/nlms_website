'use strict';

import express from 'express';

import staticRoutes from '../../apis/static.routes';

import users from '../../apis/users/routes/users.routes';
import customers from '../../apis/customers/routes/customers.routes';
import sellers from '../../apis/sellers/routes/sellers.routes';

let app = express();

app.use(users);
app.use(customers);
app.use(sellers);

app.use(staticRoutes);


export default app;
