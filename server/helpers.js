'use strict'

const Promise = require('bluebird')
const Boom = require('@hapi/boom')
const _ = require('lodash')
const query = require('./query')

/**
 * Add user module tools
 */

const user_exists = (req, type = null) => new Promise((resolve, reject) => {
	const {
		server: {
			db: {
				r,
				conn
			}
		}
	} = req
	
	// console.log('user_exists:', req.payload)
	
	/** Find user by email */
	r
		.table('users')
		.getAll(req.payload.email, {
			index: 'email'
		})
		.innerJoin(r.table('profiles'), (users, profiles) => {
			return profiles('uid').eq(users('id'))
		})
		.map((doc) => {
			return doc.merge(() => {
				return doc('left').merge({
					profile: doc('right')
				})
			})
		})
		.without('left')
		// .without(['password'])
		.without('right')
		.run(conn, (err, results) => {
			if (err) return reject(Boom.badGateway())
			
			results.toArray((err, rows) => {
				if (err) return reject(Boom.badGateway())
				/** Switch resolver */
				return type === 'login' ? resolve(rows) : resolve(_.isEmpty(rows))
			})
		})
	
})


/**
 * Get profiles
 */

const get_profiles = ({server: {db: {r, conn}}, params: {id}}, table, uid) =>
	new Promise((resolve, reject) =>
		r.table(table)
			.get(id)
			.run(conn, (err, profile) => {
				if (err) return reject(Boom.badGateway())
				
				if (!profile || profile.uid !== uid) return reject(Boom.notFound())
				
				return resolve(profile)
			})
	)

/**
 * Get jobs
 */

const get_jobs = (req, table) => new Promise(async (resolve, reject) => {
	
	console.log('Fields job helper:', req.query)
	
	const {
		params: {
			id
		},
		query: {
			company_id,
			page,
			offset
		},
		server: {
			db: {
				r,
				conn
			}
		}
	} = req
	
	/** Redirects method -> simple get */
	if (id) {
		return resolve(await query.get(req, table))
	}
	
	delete req.query.page
	delete req.query.offset
	delete req.query.company_id
	
	/** Apply pagination */
	const start = ((parseInt(page, 10) * parseInt(offset, 10)) - parseInt(offset, 10))
	const end = (start + parseInt(offset, 10))
	
	let Query = r.table(table)
	const total = await Query.filter(req.query || {}).count().run(conn)
	
	if (company_id) {
		Query = Query.getAll(company_id, {
			index: 'company_id'
		})
	}
	
	if (!_.isEmpty(req.query)) {
		Query = Query.filter(doc => {
			
			const jobposition = _.toLower(req.query.jobposition)
			const title = _.toLower(req.query.title)
			const province = _.toLower(req.query.province)
			const city = _.toLower(req.query.city)
			
			let pipe = doc('id').downcase().match(`(?i)^${jobposition || title}$`)
			
			if (jobposition) pipe = pipe.or(doc('jobposition').eq(jobposition))
			if (title) pipe = pipe.or(doc('title').downcase().match(title))
			if (province) pipe = pipe.and(doc('location')('province').downcase().match(province))
			if (city) pipe = pipe.and(doc('location')('city').downcase().match(city))
			
			return pipe
		})
	}
	
	Query.innerJoin(r.table('companies'), function (jobs, companies) {
		return jobs('company_id').eq(companies('id'))
	}).map(doc => {
		return doc.merge(() => {
			return doc('left').merge({
				company: {
					name: doc('right')('name'),
					location: doc('right')('location')
				}
			})
		})
	})
		.without('left')
		.without('right')
		.slice(start, end)
		.run(conn, (err, collection) => {
			if (err) return reject(Boom.badGateway())
			
			collection.toArray((err, items) => {
				if (err) return reject(Boom.badGateway())
				return resolve({items, total})
			})
		})
})


/**
 * Watch user scope to show/edit contents
 */
const verify_scope = _ =>
	new Promise((resolve, reject) => {
	
	})

module.exports = {
	user_exists,
	get_profiles,
	get_jobs
}