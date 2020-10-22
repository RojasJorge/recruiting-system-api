'use strict'

const config = require('../../config')
const handlers = require('../handlers')
const schemas = require('../schemas')

module.exports = [{
	method: 'POST',
	path: config.get('/api/base_path') + '/apply',
	handler: handlers.apply.add,
	options: {
		auth: {
			scope: ['umana', 'admin', 'candidate', 'company']
		},
		validate: {
			payload: schemas.apply.add
		}
	}
}, {
	method: 'PUT',
	path: config.get('/api/base_path') + '/apply/{id?}',
	handler: handlers.apply.update,
	options: {
		validate: {
			params: schemas.apply.get_id,
			payload: schemas.apply.update
		}
	}
}, {
	method: 'GET',
	path: config.get('/api/base_path') + '/apply/{id?}',
	handler: handlers.apply.get,
	options: {
		validate: {
			params: schemas.apply.get_id,
			query: schemas.apply.get
		}
	}
}, {
	method: 'GET',
	path: config.get('/api/base_path') + '/apply/candidate',
	handler: handlers.apply.candidate_apply,
	// options: {
	// 	validate: {
	// 		params: schemas.apply.get_apply_candidate_id,
	// 		query: schemas.apply.get_apply_candidate
	// 	}
	// }
}]
