'use strict'

const query = require('../query')
const Promise = require('bluebird')
const Boom = require('@hapi/boom')
const _ = require('lodash')
const helpers = require('../helpers')

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
	new Promise(async (resolve, reject) => {
		
		if (!req.params.id) return resolve(await helpers.get_each_company_applications(req))
		
		/**
		 * Detructure request
		 */
		const {
			server: {
				current,
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
				companyId,
				page,
				offset
			}
		} = req
		
		const cUser = JSON.parse(current.data)
		
		/** Remove pager from query */
		delete req.query.page
		delete req.query.offset
		
		/** Apply pagination */
		const start = ((parseInt(page, 10) * parseInt(offset, 10)) - parseInt(offset, 10))
		const end = (start + parseInt(offset, 10))
		
		let Query =
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
		
		const total = await Query.count().run(conn)
		
		Query.slice(start, end)
			.run(conn, (err, results) => {
				if (err) return reject(Boom.badGateway())
				
				results.toArray((err, items) => {
					if (err) return reject(Boom.badGateway())
					
					return resolve({items, total})
				})
			})
	})

/**
 * Apply for candidates
 * ....................
 */
const candidate_apply = req =>
	new Promise(async (resolve, reject) => {
		
		/**
		 * Detructure request
		 */
		const {
			server: {
				current,
				db: {
					r,
					conn
				}
			},
			query: {
				page,
				offset
			}
		} = req
		
		const cUser = JSON.parse(current.data)
		
		if (cUser.scope.shift() !== 'candidate') return reject(Boom.badRequest())
		
		/** Remove pager from query */
		delete req.query.page
		delete req.query.offset
		
		/** Apply pagination */
			// const start = ((parseInt(page, 10) * parseInt(offset, 10)) - parseInt(offset, 10))
			// const end = (start + parseInt(offset, 10))
		
		let Query =
				await r
					.table('applications')
					.getAll(cUser.id, {index: 'uid'})
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
									'profile': doc('left')('left')('left')('right')
								})
							})
						})
					})
					.without({
						'candidate': ['password']
					})
					.without('left')
					.without('right')
		
		const total = await Query.count().run(conn)
		
		Query.run(conn, (err, results) => {
			if (err) return reject(Boom.badGateway())
			
			results.toArray((err, items) => {
				if (err) return reject(Boom.badGateway())
				
				return resolve({items, total})
			})
		})
	})

const update_single_apply = req => new Promise((resolve, reject) => {
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
		payload: {
			status
		}
	} = req
	
	r
		.table('applications')
		.get(id)
		.update({status})
		.run(conn, (err, result) => {
			if (err) return reject(Boom.badGateway())
			
			return resolve(result)
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
		h.response(await get_apply(req)),
	candidate_apply: async (req, h) =>
		h.response(await candidate_apply(req)),
	update: async (req, h) =>
		h.response(await update_single_apply(req))
}
