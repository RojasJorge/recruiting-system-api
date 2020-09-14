'use strict'

const query = require('../query')
const table = 'companies'

module.exports = {
	get: async (req, h) =>
		h.response(await query.get(req, table)),
	add: async (req, h) => {
		
		/** Attach the user id */
		req.payload.uid = JSON.parse(req.server.current.data).id
		return h.response(await query.add(req, table))
	}
	,
	update: async (req, h) =>
		h.response(await query.update(req, table)),
	
	/** Careers (Categories) */
	career_get: async (req, h) =>
		h.response(await query.get(req, 'careers')),
	career_add: async (req, h) =>
		h.response(await query.add(req, 'careers')),
	career_update: async (req, h) =>
		h.response(await query.update(req, 'careers'))
}
