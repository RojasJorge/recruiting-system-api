'use strict'

const config = require('../../config')
const handlers = require('../handlers')
const schemas = require('../schemas')
const search = require('../search')

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
	method: 'POST',
	path: config.get('/api/base_path') + '/search',
	handler: search,
	options: {
		auth: false,
		validate: {
			payload: schemas.system.search
		}
	}
},
	// {
	// 	method: 'GET',
	// 	path: config.get('/api/base_path') + '/setup',
	// 	options: {
	// 		auth: {
	// 			scope: ['root']
	// 		},
	// 		handler: handlers.system.setup
	// 	}
	// },
]

module.exports = Main