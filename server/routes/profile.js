'use strict'

const config = require('../../config')
const handlers = require('../handlers')
const schemas = require('../schemas')

module.exports = [{
	method: 'PUT',
	path: config.get('/api/base_path') + '/profile/{id}',
	options: {
		handler: handlers.profile.update,
		auth: {
			scope: ['umana', 'admin', 'company', 'candidate']
		},
		validate: {
			params: schemas.profile.id,
			payload: schemas.profile.update
		}
	}
}, {
	method: 'GET',
	path: config.get('/api/base_path') + '/profile',
	options: {
		handler: handlers.profile.get,
		auth: {
			scope: ['umana', 'admin', 'company']
		},
		validate: {
			query: schemas.profile.get
		}
	}
}]

