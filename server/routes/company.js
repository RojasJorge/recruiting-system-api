'use strict'

const config = require('../../config')
const handlers = require('../handlers')
const schemas = require('../schemas')

/**
 * Company paths
 * ####################################################################
 */

module.exports = [{
	method: 'POST',
	path: config.get('/api/base_path') + '/company',
	options: {
		handler: handlers.company.add,
		auth: {
			scope: ['admin', 'umana', 'company', 'candidate']
		},
		validate: {
			payload: schemas.company._add
		}
	}
}, {
	method: 'GET',
	path: config.get('/api/base_path') + '/company/{id?}',
	handler: handlers.company.get,
	options: {
		auth: {
			scope: ['admin', 'umana', 'company', 'candidate']
		},
		validate: {
			query: schemas.company._get,
			params: schemas.company._get_id
		}
	}
}, {
	method: 'PUT',
	path: config.get('/api/base_path') + '/company/{id}',
	handler: handlers.company.update,
	options: {
		auth: {
			scope: ['admin', 'umana', 'company', 'candidate']
		},
		validate: {
			payload: schemas.company._update,
			params: schemas.company._get_id
		}
	}
}, {

	/**
	 * Company careers
	 */

	method: 'POST',
	path: config.get('/api/base_path') + '/career',
	handler: handlers.company.career_add,
	options: {
		auth: {
			scope: ['admin', 'umana', 'company', 'candidate']
		},
		validate: {
			payload: schemas.company._career_add
		}
	}
}, {
	method: 'GET',
	path: config.get('/api/base_path') + '/career',
	handler: handlers.company.career_get,
	options: {
		auth: {
			scope: ['admin', 'umana', 'company', 'candidate']
		},
		validate: {
			query: schemas.company._career_get
		}
	}
}, {
	method: 'PUT',
	path: config.get('/api/base_path') + '/career/{id?}',
	handler: handlers.company.career_update,
	options: {
		auth: {
			scope: ['admin', 'umana', 'company', 'candidate']
		},
		validate: {
			payload: schemas.company._career_update,
			params: schemas.company._get_id
		}
	}
}]
