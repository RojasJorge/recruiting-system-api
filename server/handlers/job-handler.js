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
	update: async (req, h) => {
		
		const {
			params: {
				id
			},
			server: {
				db: {
					r,
					conn
				}
			}
		} = req
		
		/** Current user from token */
		const current = JSON.parse(req.server.current.data)
		
		/** Reject if job is not found */
		const job = await r.table(table).get(id).run(conn)
		if(!job) return Boom.notFound()
		
		/** Reject if company doesn't match */
		const company = await r.table('companies').get(job.company_id).run(conn)
		if(!company) return Boom.badRequest()
		
		/** Reject if !current.id */
		if(company.uid !== current.id) return Boom.badRequest()
		
		/** Exec query */
		return h.response(await query.update(req, table))
	}
}