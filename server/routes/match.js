'use strict'

const handlers = require('../handlers')
const schemas = require('../schemas')
const config = require('../../config')

module.exports = [{
	method: 'GET',
	path: config.get('/api/base_path') + '/match/{jobId}',
	handler: handlers.match.candidates_to_job,
	options: {
		validate: {
			params: schemas.match.candidates_to_job
		}
	}
}]
