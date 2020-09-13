'use strict'

const config = require('../../config')
const handlers = require('../handlers')
const schemas = require('../schemas')

module.exports = [{
	method: 'PUT',
	path: config.get('/api/base_url') + '/profile/{uid}/{id}',
	// handler:
}]

