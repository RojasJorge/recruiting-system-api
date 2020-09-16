'use strict'

const query = require('../query')
const Boom = require('@hapi/boom')
const Promise = require('bluebird')
const helpers = require('../helpers')
const table = 'jobs'

module.exports = {
	get: async (req, h) =>
		h.response(await helpers.get_jobs(req, table)),
	add: async (req, h) =>
		h.response(await query.add(req, table)),
	update: async (req, h) =>
		h.response(await query.update(req, table))
}