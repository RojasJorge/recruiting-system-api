'use strict';

const Confidence = require('confidence')
const pack = require('./package');

const config = {
  app: {
    host: {
      $env: 'APP_HOST',
      $default: 'localhost',
    },
    port: {
      $env: 'APP_PORT',
      $default: 3026,
    },
    name: {
      $env: 'APP_NAME',
      $default: pack.name,
    },
    description: {
      $env: 'APP_DESCRIPTION',
      $default: pack.description,
    },
    key: {
      $env: 'APP_KEY',
      $default: '3bac31b65634426cd4612714756e0364',
    },
    secret: {
      $env: 'APP_SECRET',
      $default: '779fd3559ac35655093fc3b722ae34b1',
    },
  },
  api: {
    secure: {
      $env: 'API_IS_SECURE',
      $default: 'false',
    },
    base_path: {
      $env: 'API_BASE_PATH',
      $default: '/api/v1',
    },
  },
  db: {
    name: {
      $env: 'DB_NAME',
      $default: 'umana',
    },
    host: {
      $env: 'DB_HOST',
      $default: 'localhost',
    },
    port: {
      $env: 'DB_PORT',
      $default: 3026,
    },
  },
};

const store = new Confidence.Store(config),
  criteria = {
    env: process.env.APP_ENV,
  };

module.exports = {
  get: key => store.get(key, criteria),
};
