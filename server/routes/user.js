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
      payload: schemas.user.login
    }
  }
}, {
  method: 'POST',
  path: config.get('/api_base_path') + '/user',
  handler: handlers.user.add,
  options: {
    auth: {
      scope: ['admin', 'umana', 'company', 'candidate']
    },
    validate: {
      payload: schemas.user.add
    }
  }
}, {
  method: 'GET',
  path: config.get('/api_base_path') + '/user/{id?}',
  handler: handlers.user.get,
  options: {
    auth: false,
    auth: {
      scope: ['admin', 'umana', 'company', 'candidate']
    },
    validate: {
      query: schemas.user.get,
      params: schemas.user.get_id
    }
  }
}, {
  method: 'PUT',
  path: config.get('/api_base_path') + '/user/{id}',
  handler: handlers.user.update,
  options: {
    auth: {
      scope: ['admin', 'umana', 'company', 'candidate']
    },
    validate: {
      payload: schemas.user.update,
      params: schemas.user.get_id
    }
  }
}, {
  method: 'POST',
  path: config.get('/api_base_path') + '/refresh',
  handler: handlers.user.refresh,
  options: {
    auth: {
      scope: ['admin', 'umana', 'company', 'candidate']
    },
    // validate: {
    //   payload: schemas.user._refresh
    // }
  }
}]

module.exports = User