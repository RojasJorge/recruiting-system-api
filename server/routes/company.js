'use strict'

const config = require('../../config')
const handlers = require('../handlers')
const schemas = require('../schemas')

/**
 * Company paths
 * ####################################################################
 */

const Company = [{
  method: 'POST',
  path: config.get('/api_base_path') + '/company',
  handler: handlers.company.add,
  options: {
    auth: {
      scope: ['admin', 'root', 'company']
    },
    validate: {
      payload: schemas.company._add
    }
  }
}, {
  method: 'GET',
  path: config.get('/api_base_path') + '/company',
  handler: handlers.company.get,
  options: {
    auth: {
      scope: ['admin', 'root', 'candidate', 'company']
    },
    validate: {
      query: schemas.company._get
    }
  }
}, {
  method: 'PUT',
  path: config.get('/api_base_path') + '/company',
  handler: handlers.company.update,
  options: {
    auth: {
      scope: ['admin', 'root', 'company']
    },
    validate: {
      payload: schemas.company._update
    }
  }
}, {

  /**
   * Company careers
   */

  method: 'POST',
  path: config.get('/api_base_path') + '/career',
  handler: handlers.company.career_add,
  options: {
    auth: {
      scope: ['admin', 'root', 'company']
    },
    validate: {
      payload: schemas.company._career_add
    }
  }
}, {
  method: 'GET',
  path: config.get('/api_base_path') + '/career',
  handler: handlers.company.career_get,
  options: {
    auth: {
      scope: ['admin', 'root', 'candidate', 'company']
    },
    validate: {
      query: schemas.company._career_get
    }
  }
}, {
  method: 'PUT',
  path: config.get('/api_base_path') + '/career',
  handler: handlers.company.career_update,
  options: {
    auth: {
      scope: ['admin', 'root', 'company']
    },
    validate: {
      payload: schemas.company._career_update
    }
  }
}]

module.exports = Company