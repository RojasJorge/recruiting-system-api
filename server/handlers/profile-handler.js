'use strict'

const query = require('../query')
const Boom = require('@hapi/boom')
const helpers = require('../helpers')
const table = 'profiles'
const Promise = require('bluebird')

const filter_profiles = req => new Promise((resolve, reject) => {
	const {server: {db: {r, conn}}} = req
	
	r
		.table('profiles')
		.filter(req.query || {})
		.run(conn, (err, result) => {
			if(err) return reject(Boom.notFound())
			
			result.toArray((err, rows) => {
				if(err) return reject(Boom.notFound())
				
				return resolve(rows)
			})
		})
	
})

module.exports = {
	update: async (req, h) => {
		
		/** Check for profile and rejects if not. */
		await helpers.get_profiles(req, table, JSON.parse(req.server.current.data).id /** Current user id from token */)
		
		// console.log(JSON.stringify(req.payload, false, 2))
		// return h.response(true)
		
		/** Exec query */
		return h.response(await query.update(req, table))
	},
	get: async (req, h) =>
		h.response(await filter_profiles(req))
}
