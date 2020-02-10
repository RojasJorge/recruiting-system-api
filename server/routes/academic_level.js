'use strict'

const config = require('../../config')
const handlers = require('../handlers')
const schemas = require('../schemas')

/**
 * Academic Level paths
 * ####################################################################
 */

const AcademicLevel = [{
  method: 'POST',
  path: config.get('/api_base_path') + '/academic-level',
  handler: handlers.academic_level.add,
  options: {
    auth: {
      scope: ['admin', 'root', 'company']
    },
    validate: {
      payload: schemas.academic_level._add
    }
  }
}, {
  method: 'GET',
  path: config.get('/api_base_path') + '/academic-level',
  handler: handlers.academic_level.get,
  options: {
    auth: {
      scope: ['admin', 'root', 'candidate', 'company']
    },
    validate: {
      query: schemas.academic_level._get
    }
  }
}, {
  method: 'PUT',
  path: config.get('/api_base_path') + '/academic-level',
  handler: handlers.academic_level.update,
  options: {
    auth: {
      scope: ['admin', 'root', 'company']
    },
    validate: {
      payload: schemas.academic_level._update
    }
  }
}]

module.exports = AcademicLevel