'use strict'

const query = require('../query')
const table = 'companies'
const Boom = require('@hapi/boom')

module.exports = {
	get: async (req, h) =>
		h.response(await query.get(req, table)),
	add: async (req, h) => {
		
		/** Attach the user id */
		req.payload.uid = JSON.parse(req.server.current.data).id
		return h.response(await query.add(req, table))
	},
	update: async (req, h) => {
		
		/** Get current user */
		const current = JSON.parse(req.server.current.data)
		
		/** Get company by id */
		const company = await req.server.db.r.table(table).get(req.params.id).run(req.server.db.conn)
		
		/** Reject if !company */
		if (!company) return Boom.notFound()
		
		/** Reject if owner id does not match */
		if (current.scope[0] !== 'umana' && company.uid !== current.id) return Boom.forbidden()
		
		return h.response(await query.update(req, table))
	},
	
	/** Careers (Categories) */
	career_get: async (req, h) =>
		h.response(await query.get(req, 'careers')),
	career_add: async (req, h) =>
		h.response(await query.add(req, 'careers')),
	career_update: async (req, h) =>
		h.response(await query.update(req, 'careers'))
}
