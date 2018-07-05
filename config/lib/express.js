'use strict';

/**
 * Module dependencies.
 */
import express from 'express';
import bodyParser from 'body-parser';
import compress from 'compression';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import connectMongo from 'connect-mongo';
import path from 'path';
import helmet from 'helmet';
import cors from 'cors';
import expressJwt from 'express-jwt';
import consolidate from 'consolidate';
import winston from 'winston';
import logger from 'logops';
import expressLogging from 'express-logging';
var MemcachedStore = require("connect-memcached")(session);

import config from '../config';
import routesV1_0 from '../routes/routes.v1_0';
//import utils from '../../common/utils';

const MongoStore = connectMongo(session);

/**
 * Initialize application middleware
 */

function initMiddleware(app) {
    // Showing stack errors
    app.set('showStackError', true);

    // Enable jsonp
    app.enable('jsonp callback');

    // Should be placed before express.static
    app.use(compress({
        filter: function(req, res) {
            return (/json|text|javascript|css|font|svg/).test(res.getHeader('Content-Type'));
        },
        level: 9
    }));

    // Request body parsing middleware should be above methodOverride
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(methodOverride());

    // Add the cookie parser and flash middleware
    app.use(cookieParser());
    app.use(session({
        secret: 'kashkdhakjasdhk123123kj1h23kj1h23k1h23k12',
        saveUninitialized: true,
        resave: true,
        cookie: { maxAge: 365 * 60 * 60 * 1000 },
        proxy: "true",
        store: new MemcachedStore({
          hosts: ["127.0.0.1:11211"],
          secret: "123, easy as ABC. ABC, easy as 123" // Optionally use transparent encryption for memcache session data
        })
    }));

    app.use(cors());
    app.set('view engine', 'ejs');
    app.set('views');

    app.use(express.static('public'));
}


// //Provide different secrets for admin and product routes
// const getJwtSecret = function (req, payload, done) {
//   if (req.originalUrl.indexOf('/v1/admin') > -1) {
//     done(null, config.jwt.adminSecret);
//   } else {
//     done(null, config.jwt.secret);
//   }
// };

/**
 * Initialize express-jwt middleware to verify jwt tokens for each and every route
 */
function initJwtMiddleware(app) {
    // let allowedRoutes = ['/', '/index', '/features', '/aboutus', '/contactus', '/appsinfo', /^\/appsinfo\/.*/];

    // app.use(expressJwt({secret: config.default.jwt.secret}).unless({path: allowedRoutes}));

    // app.use(function (err, req, res, next) {

    //   if (err.name === 'UnauthorizedError') {
    //     res.status(401).json({
    //       status: 'unauthorized',
    //       message: 'You are not authorized to access',
    //       errors: {
    //         message: 'Invalid token'
    //       }
    //     });
    //   }
    // });

    //app.use(utils.checkForJWT);
}

/**
 * Configure Express session
 */
function initSession(app, db) {
    // Express MongoDB session storage
    app.use(session({
        saveUninitialized: true,
        resave: true,
        secret: config.sessionSecret,
        cookie: {
            maxAge: config.sessionCookie.maxAge,
            httpOnly: config.sessionCookie.httpOnly,
            secure: config.sessionCookie.secure && config.secure.ssl
        },
        key: config.sessionKey,
        store: new MongoStore({
            mongooseConnection: db.connection,
            collection: config.sessionCollection
        })
    }));
}

/**
 * Configure the modules ACL policies
 */
function initModulesPolicies(app) {
    // Globbing policy files
    config.files.policies.forEach(function(policyPath) {
        require(path.resolve(policyPath)).invokeRolesPolicies();
    });
}

/**
 * Configure the modules server routes
 */
function initModulesRoutes(app) {
    // Globbing routing files
    // config.files.routes.forEach(function (routePath) {
    //   require(path.resolve(routePath))(app);
    // });
    app.use(routesV1_0);

}

/**
 * Configure Helmet headers configuration
 */
function initHelmetHeaders(app) {
    // Use helmet to secure Express headers
    let SIX_MONTHS = 15778476000;
    app.use(helmet.xframe());
    app.use(helmet.xssFilter());
    app.use(helmet.nosniff());
    app.use(helmet.ienoopen());
    app.use(helmet.hsts({
        maxAge: SIX_MONTHS,
        includeSubdomains: true,
        force: true
    }));
    app.disable('x-powered-by');
}

/**
 * Configure Cors module to allow specific domains
 */

function handleCors(app) {
    let whitelist = ['http://localhost:3000', 'http://localhost:5314',
        'http://10.0.0.9:3000', 'http://10.0.0.9:5314'
    ];

    let corsOptions = {
        origin: function(origin, callback) {
            let originIsWhitelisted = whitelist.indexOf(origin) !== -1;
            callback(null, originIsWhitelisted);
        }
    };

    app.use(cors(corsOptions));
}

/**
 * Initialize the Express application
 */
export default function init(db) {
    // Initialize express app
    let app = express();

    app.use(expressLogging(logger));
    app.enable('trust proxy');

    // Initialize middlewares
    initMiddleware(app);

    // Initialize session config
    //initSession(app, db);

    // Initialize helmet
    // initHelmetHeaders(app);

    // Enable and handle cors
    // handleCors(app);

    // Initialize middlewares
    //initJwtMiddleware(app);

    // Initialize application module config files
    // initModulesConfiguration(app, db);

    // Initialize modules server authorization policies
    // initModulesPolicies(app);

    // Initialize modules server routes
    initModulesRoutes(app);

    winston.loggers.add('platform-core', {
        console: config.default.winston.console,
        file: config.default.winston.file
    });

    winston.loggers.get('platform-core');

    return app;
}
