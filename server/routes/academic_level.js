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
	path: config.get('/api/base_path') + '/academic-level',
	handler: handlers.academic_level.add,
	options: {
		auth: {
			scope: ['admin', 'umana', 'company']
		},
		validate: {
			payload: schemas.academic_level._add
		}
	}
}, {
	method: 'GET',
	path: config.get('/api/base_path') + '/academic-level/{id?}',
	handler: handlers.academic_level.get,
	options: {
		auth: false,
		validate: {
			query: schemas.academic_level._get,
			params: schemas.academic_level._get_id
		}
	}
}, {
	method: 'PUT',
	path: config.get('/api/base_path') + '/academic-level/{id}',
	handler: handlers.academic_level.update,
	options: {
		auth: {
			scope: ['admin', 'umana', 'company']
		},
		validate: {
			payload: schemas.academic_level._update,
			params: schemas.academic_level._get_id
		}
	}
}]

module.exports = AcademicLevel
