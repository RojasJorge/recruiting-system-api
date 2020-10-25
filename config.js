'use strict';

const Confidence = require('confidence')
const pack = require('./package');
require('dotenv').config()

const config = {
  app: {
    host: {$env: 'APP_HOST', $default: 'localhost'},
    port: {$env: 'APP_PORT', $default: 3026},
    name: {$env: 'APP_NAME', $default: pack.name},
    description: {$env: 'APP_DESCRIPTION', $default: pack.description},
    secret: {$env: 'APP_SECRET', $default: '779fd3559ac35655093fc3b722ae34b1'},
  },
  api: {
    secure: {$env: 'API_IS_SECURE', $default: 'false'},
    base_path: {$env: 'API_BASE_PATH', $default: '/api/v1'},
  },
  db: {
    name: {$env: 'APP_DB_NAME', $default: 'umana'},
    host: {$env: 'APP_DB_HOST', $default: 'localhost'},
    port: {$env: 'APP_DB_PORT', $default: 28015},
  },
  mail: {
    server: {$env: 'APP_MAIL_SERVER', $default: 'http://localhost:30300'},
    paths: {$env: 'APP_MAIL_SERVER_PATHS', $default: '/user/new-account, /user/welcome'},
  },
  storage: {
    server: {$env: 'APP_FILE_STORAGE_SERVER', $default: 'http://localhost:30012'}
  }
}

const store = new Confidence.Store(config),
  criteria = {
    env: process.env.APP_ENV
  }

module.exports = {
  get: key => store.get(key, criteria),
  meta: key => store.meta(key, criteria)
}
