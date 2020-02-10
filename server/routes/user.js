'use strict'

const config = require('../../config')
const handlers = require('../handlers')
const schemas = require('../schemas')

/**
 * User paths
 * ####################################################################
 */

const User = [{
  method: 'POST',
  path: config.get('/api_base_path') + '/login',
  options: {
    auth: false,
    handler: handlers.user.login,
    validate: {
      payload: schemas.user._login
    }
  }
}, {
  method: 'POST',
  path: config.get('/api_base_path') + '/user',
  handler: handlers.user.add,
  options: {
    auth: false,
    validate: {
      payload: schemas.user._add
    }
  }
}, {
  method: 'GET',
  path: config.get('/api_base_path') + '/user/{id?}',
  handler: handlers.user.get,
  options: {
    auth: false,
    // auth: {
    //   scope: ['admin', 'root', 'candidate']
    // },
    validate: {
      query: schemas.user._get,
      params: schemas.user._get_id
    }
  }
}, {
  method: 'PUT',
  path: config.get('/api_base_path') + '/user/{id}',
  handler: handlers.user.update,
  options: {
    auth: {
      scope: ['admin', 'root', 'candidate']
    },
    validate: {
      payload: schemas.user._update,
      params: schemas.user._get_id
    }
  }
}, {
  method: 'POST',
  path: config.get('/api_base_path') + '/refresh',
  handler: handlers.user.refresh,
  options: {
    auth: {
      scope: ['admin', 'root', 'candidate']
    },
    // validate: {
    //   payload: schemas.user._refresh
    // }
  }
}]

module.exports = User