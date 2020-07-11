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
      scope: ['admin', 'root', 'company']
    },
    validate: {
      payload: schemas.job._add
    }
  }
}, {
  method: 'GET',
  path: config.get('/api/base_path') + '/job',
  handler: handlers.job.get,
  options: {
    auth: {
      scope: ['admin', 'root', 'candidate', 'company']
    },
    validate: {
      query: schemas.job._get
    }
  }
}, {
  method: 'PUT',
  path: config.get('/api/base_path') + '/job',
  handler: handlers.job.update,
  options: {
    auth: {
      scope: ['admin', 'root', 'company']
    },
    validate: {
      payload: schemas.job._update
    }
  }
}]

module.exports = Job