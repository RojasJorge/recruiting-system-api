'use strict'

const query = require('../query')
const Promise = require('bluebird')
const Boom = require('@hapi/boom')
const _ = require('lodash')

const find_apply = req =>
	new Promise((resolve, reject) => {
		
		const {server: {db: {r, conn}}, payload: {uid, jobId}} = req
		
		r
			.table('applications')
			.filter(doc => doc('uid').eq(uid).and(doc('jobId').eq(jobId)))
			.run(conn, (err, results) => {
				if (err) reject(Boom.badGateway())
				results.toArray((err, rows) => {
					if (err) reject(Boom.badGateway())
					return resolve(rows)
				})
			})
	})

const get_apply = req =>
	new Promise((resolve, reject) => {
		
		/**
		 * Detructure request
		 */
		const {
			server: {
				db: {
					r,
					conn
				}
			},
			params: {
				id
			},
			query: {
				uid,
				jobId,
				companyId
			}
		} = req
		
		r
			.table('applications').filter(doc => {
				
				/** First look for the id */
			if (id) return doc('id').eq(id)
			
			/** Check another params (filtering) */
			if (uid && jobId && !companyId) return doc('uid').eq(uid).and(doc('jobId').eq(jobId))
			if (uid && !jobId && !companyId) return doc('uid').eq(uid)
			if (!uid && !jobId && companyId) return doc('companyId').eq(companyId)
			if (!uid && jobId && !companyId) return doc('jobId').eq(jobId)
			
			return {}
		})
			.innerJoin(r.table('profiles'), (applications, profiles) => profiles('uid').eq(applications('uid')))
			.eqJoin(r.row('left')('jobId'), r.db('umana').table('jobs'))
			.eqJoin(r.row('right')('company_id'), r.db('umana').table('companies'))
			.eqJoin(r.row('left')('left')('left')('uid'), r.db('umana').table('users'))
			.map(doc => {
				return doc.merge(_ => {
					return doc.merge({
						'apply': doc('left')('left')('left')('left'),
						'job': doc('left')('left')('right'),
						'company': doc('left')('right'),
						'candidate': doc('right').merge({
							profile: doc('left')('left')('left')('right')
						})
					})
				})
			})
			.without({
				'candidate': ['password']
			})
			.without('left')
			.without('right')
			.run(conn, (err, results) => {
				if (err) return reject(Boom.badGateway())
				
				results.toArray((err, rows) => {
					if (err) return reject(Boom.badGateway())
					
					return resolve(rows)
				})
			})
	})

module.exports = {
	add: async (req, h) => {
		
		/** Check if record exists */
		if (!_.isEmpty(await find_apply(req))) return Boom.locked()
		
		/** Returns insert results */
		return h.response(await query.add(req, 'applications'))
	},
	get: async (req, h) =>
		h.response(await get_apply(req))
}
