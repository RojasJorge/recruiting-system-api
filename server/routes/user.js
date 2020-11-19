'use strict'

const config = require('../../config')
const handlers = require('../handlers')
const schemas = require('../schemas')
const Joi = require('joi')

/**
 * User paths
 * ####################################################################
 */

const User = [{
	method: 'POST',
	path: config.get('/api/base_path') + '/login',
	options: {
		auth: false,
		handler: handlers.user.login,
		validate: {
			payload: schemas.user.login
		}
	}
}, {
	method: 'POST',
	path: config.get('/api/base_path') + '/user',
	handler: handlers.user.add,
	options: {
		auth: false,
		// auth: {
		//   scope: ['admin', 'umana', 'company', 'candidate']
		// },
		validate: {
			payload: schemas.user.add
		}
	}
}, {
	method: 'GET',
	path: config.get('/api/base_path') + '/user/{id?}',
	handler: handlers.user.get,
	options: {
		// auth: false,
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
	path: config.get('/api/base_path') + '/user/{id}',
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
	method: 'GET',
	path: config.get('/api/base_path') + '/verify/{hash}',
	handler: handlers.user.verify,
	options: {
		auth: false,
		validate: {
			params: Joi.object({
				hash: Joi.string().max(36).required()
			})
		}
	}
}, {
	method: 'POST',
	path: config.get('/api/base_path') + '/reset-password',
	handler: handlers.user.request_password_reset,
	options: {
		auth: false,
		validate: {
			payload: Joi.object({
				email: Joi.string().email().required()
			})
		}
	}
}, {
	method: 'PUT',
	path: config.get('/api/base_path') + '/reset-password',
	handler: handlers.user.reset_password,
	options: {
		auth: false,
		validate: {
			payload: Joi.object({
				hash: Joi.string().max(36).required(),
				password: Joi.string().max(36).required()
			})
		}
	}
}, {
	method: 'POST',
	path: config.get('/api/base_path') + '/invite-a-user',
	handler: handlers.user.invite_a_user,
	options: {
		auth: {
			scope: ['umana', 'company']
		},
		validate: {
			payload: Joi.object({
				profileId: Joi.string().required(),
				companyId: Joi.string().required(),
				jobId: Joi.string().required()
			})
		}
	}
}]

module.exports = User