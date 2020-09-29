'use strict'

const config = require('../../config')
const handlers = require('../handlers')
const schemas = require('../schemas')

/**
 * Company paths
 * ####################################################################
 */

const Job = [{
  method: 'POST',
  path: config.get('/api/base_path') + '/job',
  handler: handlers.job.add,
  options: {
    auth: {
      scope: ['admin', 'umana', 'company', 'candidate']
    },
    validate: {
      payload: schemas.job._add
    }
  }
}, {
  method: 'GET',
  path: config.get('/api/base_path') + '/job/{id?}',
  handler: handlers.job.get,
  options: {
    auth: false,
    validate: {
      query: schemas.job._get,
      params: schemas.job._get_id
    }
  }
}, {
  method: 'PUT',
  path: config.get('/api/base_path') + '/job/{id}',
  handler: handlers.job.update,
  options: {
    auth: {
      scope: ['admin', 'umana', 'company', 'candidate']
    },
    validate: {
      payload: schemas.job._update,
      params: schemas.job._get_id
    }
  }
}]

module.exports = Job