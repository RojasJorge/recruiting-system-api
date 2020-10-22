'use strict'

const query = require('../query')
const Boom = require('@hapi/boom')
const helpers = require('../helpers')
const table = 'profiles'

module.exports = {
	update: async (req, h) => {
		
		/** Check for profile and rejects if not. */
		await helpers.get_profiles(req, table, JSON.parse(req.server.current.data).id /** Current user id from token */)
		
		// console.log(JSON.stringify(req.payload, false, 2))
		// return h.response(true)
		
		/** Exec query */
		return h.response(await query.update(req, table))
	}
}
