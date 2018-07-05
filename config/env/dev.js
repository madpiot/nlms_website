'use strict';

export default {
  app: {
      title: 'NLMS Details',
      description: 'NLMS Details'
  },
  db: {
      mongodb: {
          uri: 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/nlmsdevdb',
          options: {
              user: '',
              pass: ''
          },
          debug: process.env.MONGODB_DEBUG || false
      }
  },
  jwt: {
      normal: {
          secret: 'qCZe6np3uSELbnQDP4JBvFkRmbbFw4aA',
          expiresIn: '365d' //365 days
      },
      password: {
        secret: 'gJdFGPq22rVZDJWP9XnhUwRjy3U5whDy',
        expiresIn: '1h'
      }
  },
  sendgrid: {
      apiKey: '<key>',
      defaultEmailFromName: 'no reply bot - nlms',
      defaultEmailFrom: 'no-reply@nlms.com'
  },
  winston: {
      console: {
          colorize: true,
          timestamp: true,
          prettyPrint: true
      },
      file: {
          filename: 'logs/error.log',
          timestamp: true,
          maxsize: 2048,
          json: true,
          colorize: true,
          level: 'error'
      }
  },
  awsS3: {
      bucketName: 'nlmsdev',
  },
  version: 'v1.0',
  api: 'http://localhost:9000',
  port: process.env.PORT || 9000
};
