'use strict';
/**
 * Module dependencies.
 */
import chalk from 'chalk';
import config from '../config';
import express from './express';
import { connect, loadModels } from './mongoose';
import events from "events";
events.EventEmitter.prototype._maxListeners = 100;
//MoySQL Config
// config.files.models.forEach(function(modelPath) {
//     require(path.resolve(modelPath));
// });

// const server = express();

// server.listen(config.default.port, function() {
//     console.log(chalk.green(config.default.app.title + ' is running on port ' + config.default.port));
// });
// export default server;
const app = connect(function(db) {
    loadModels();

    // Initialize express
    const server = express(db);

    server.listen(config.default.port, function() {
        console.log(chalk.green(config.default.app.title + ' is running on port ' + config.default.port));
    });

    return server;
});



export default app;
