'use strict'

const config = require('../../config')
const handlers = require('../handlers')
const schemas = require('../schemas')

/**
 * System paths
 * ####################################################################
 */

const Main = [{
  method: 'GET',
  path: '/',
  options: {
    auth: false,
    handler: async (req, h) => {
      return h.response({
        project: 'Umana',
        version: config.get('/version')
      })
    }
  }
}, {
  method: 'GET',
  path: config.get('/api_base_path') + '/setup',
  options: {
    auth: {
      scope: ['root']
    },
    handler: handlers.system.setup
  }
}, {
  method: 'GET',
  path: config.get('/api_base_path') + '/avatar',
  handler: handlers.system.avatar_get,
  options: {
    auth: {
      scope: ['admin', 'root', 'candidate', 'company']
    },
    validate: {
      query: schemas.system.avatar_get
    }
  }
}, {
  method: 'POST',
  path: config.get('/api_base_path') + '/avatar',
  handler: handlers.system.avatar_add,
  options: {
    auth: {
      scope: ['admin', 'root', 'candidate', 'company']
    },
    validate: {
      payload: schemas.system.avatar_add
    }
  }
}]

module.exports = Main