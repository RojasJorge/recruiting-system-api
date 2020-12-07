'use strict'

const Promise = require('bluebird')
const Boom = require('@hapi/boom')
const _ = require('lodash')
// const query = require('./query')
const handlers = require('./handlers/system-handler')

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

const get_single_job = req => new Promise((resolve, reject) => {
	
	/** Extract db tools & connection */
	const {server: {db: {r, conn}}, params: {id}} = req
	
	r.table('jobs').get(id).run(conn, (err, result) => {
		if (err) reject(err)
		
		return resolve(result)
	})
	
})

const get_single_company = (r, conn, cid) => new Promise((resolve, reject) => {
	
	r.table('companies').get(cid).run(conn, (err, result) => {
		if (err) reject(err)
		
		return resolve(result)
	})
	
})

const get_jobs = (req, table) => new Promise(async (resolve, reject) => {
	
	const current = await handlers.add_scope(req)
	
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
		let single = await get_single_job(req)
		
		if (single) {
			const parent = await get_single_company(r, conn, single.company_id)
			
			if (parent) {
				single.company = {
					name: parent.name,
					location: parent.location,
					avatar: parent.avatar
				}
			}
		}
		
		return resolve(single)
	}
	
	delete req.query.page
	delete req.query.offset
	delete req.query.company_id
	
	/** Apply pagination */
	const start = ((parseInt(page, 10) * parseInt(offset, 10)) - parseInt(offset, 10))
	const end = (start + parseInt(offset, 10))
	
	let Query = r.table(table)
	
	if (company_id && !req.query.jobposition) {
		Query = Query.getAll(company_id, {
			index: 'company_id'
		})
			.filter(req.query || {})
	} else {
		/**
		 * This returns rows filtered
		 */
		
		if (!_.isEmpty(req.query)) Query = Query.filter(doc => map_filters(req, doc))
		
		Query = Query.innerJoin(r.table('companies'), function (jobs, companies) {
			let pipe = jobs('company_id').eq(companies('id'))
			
			if (current) {
				const owner = JSON.parse(current.data)
				if (owner.scope[0] === 'company') {
					pipe = pipe.and(companies('uid').eq(owner.id))
				}
			}
			
			return pipe
		}).map(doc => {
			return doc.merge(() => {
				return doc('left').merge({
					company: {
						name: doc('right')('name'),
						location: doc('right')('location'),
						avatar: doc('right')('avatar')
					}
				})
			})
		})
			.without('left')
			.without('right')
	}
	
	const total = await Query.count().run(conn)
	
	// console.log('total:', total)
		
		Query.slice(start, end)
		.run(conn, (err, collection) => {
			// if (err) return reject(Boom.badGateway())
			if (err) throw err
			
			collection.toArray((err, items) => {
				// if (err) return reject(Boom.badGateway())
				if (err) throw err
				
				return resolve({items, total})
			})
		})
})

/** Map filters */
const map_filters = (req, doc) => {
	const jobposition = _.toLower(req.query.jobposition)
	const title = _.toLower(req.query.title)
	const province = _.toLower(req.query.province)
	const city = _.toLower(req.query.city)
	const status = _.toLower(req.query.status)
	
	if(title && status) {
		return doc('status').downcase().eq(status)
			.and(doc('title').downcase().match(title))
	}
	
	/**
	 * Validate
	 */
	
	if (jobposition && !title && !province && !city)
		return doc('jobposition').downcase().eq(jobposition)
	
	if (jobposition && title && !province && !city)
		return doc('jobposition').downcase().eq(jobposition)
			.and(doc('title').downcase().match(title))
	
	if (jobposition && title && province && !city)
		return doc('jobposition').downcase().eq(jobposition)
			.and(doc('title').downcase().match(title))
			.and(doc('branch')('province').downcase().eq(province))
	
	if (jobposition && title && province && city)
		return doc('jobposition').downcase().eq(jobposition)
			.and(doc('title').downcase().match(title))
			.and(doc('branch')('province').downcase().eq(province))
			.and(doc('branch')('city').downcase().eq(city))
	
	/**
	 * Validate single
	 */
	if (!jobposition && title && !province && !city)
		return doc('title').downcase().match(title)
	
	if (!jobposition && !title && province && !city)
		return doc('branch')('province').downcase().eq(province)
	
	if (!jobposition && !title && province && city)
		return doc('branch')('province').downcase().eq(province)
			.and(doc('branch')('city').downcase().eq(city))
	
	if (jobposition && !title && province && !city)
		return doc('title').downcase().match(title)
			.and(doc('branch')('province').downcase().eq(province))
	
	if (jobposition && !title && province && !city)
		return doc('jobposition').downcase().eq(jobposition)
			.and(doc('branch')('province').downcase().eq(province))
	
	if (jobposition && !title && province && city)
		return doc('jobposition').downcase().eq(jobposition)
			.and(doc('branch')('province').downcase().eq(province))
			.and(doc('branch')('city').downcase().eq(city))
	
	if (status) return doc('status').downcase().eq(status)
	
	return {}
}

/**
 * Watch applys by company
 */
const get_each_company_applications = async ({server: {current, db: {r, conn}}, query: {companyId, page, offset, jobId}}) => {
	// console.log('pager:', page, offset)
	
	/** PAGER */
	const start = ((parseInt(page, 10) * parseInt(offset, 10)) - parseInt(offset, 10))
	const end = (start + parseInt(offset, 10))
	
	const cUser = JSON.parse(current.data)
	const scope = cUser.scope[0]
	
	// console.log('User scope:', cUser)
	let companies = []
	
	if (scope === 'umana') {
		companies = await new Promise((resolve, reject) => {
			
			let GET_COMPANIES = r.table('companies')
			
			if (companyId) {
				GET_COMPANIES = GET_COMPANIES.get(companyId)
			}
			
			GET_COMPANIES.run(conn, (err, results) => {
				
				if (companyId) return resolve([results])
				
				results.toArray((err, rows) => resolve(rows))
			})
		})
	}
	
	if (scope === 'company') {
		companies = await new Promise((resolve, reject) => {
			
			let GET_COMPANIES = r.table('companies')
			
			if (companyId) {
				GET_COMPANIES = GET_COMPANIES.get(companyId)
			} else {
				GET_COMPANIES = GET_COMPANIES.getAll(cUser.id, {index: 'uid'})
			}
			
			GET_COMPANIES.run(conn, (err, results) => {
				
				if (companyId) return resolve([results])
				
				results.toArray((err, rows) => resolve(rows))
			})
		})
	}
	
	return Promise.reduce(companies, (acc, current) => {
		return new Promise(async (resolve, reject) => {
			
			// console.log('Filters for applications:', jobId)
			
			await r
				.table('applications')
				.filter(doc => {
					let pipe = doc('companyId').eq(current.id)
					if (jobId) pipe = pipe.and(doc('jobId').eq(jobId))
					
					return pipe
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
				.slice(start, end)
				.run(conn, (err, results) => {
					if (err) throw err
					
					results.toArray((err, items) => {
						if (err) throw err
						
						current.applications = items
						acc.push(current)
					})
				})
			
			// current.applications = applications
			// current.applications = []
			// acc.push(current)
			return resolve(acc)
			
		})
	}, [])
		.then(result => result)
		.catch(err => new Boom.badImplementation('Scheme error'))
}

const verify_account = (req, table) =>
	new Promise((resolve, reject) => {
		const {
			server: {
				db: {
					r,
					conn
				}
			},
			params: {
				hash
			}
		} = req
		
		r.table(table).filter({
			verified: hash
		})
			.run(conn, (err, result) => {
				if (err) return reject(Boom.notFound())
				
				result.toArray((err, rows) => {
					if (err) return reject(Boom.notFound())
					return resolve(rows)
				})
			})
	})

const update_verified_user = (db, id) =>
	new Promise((resolve, reject) => {
		db.r.table('users').get(id).update({verified: ''}).run(db.conn, (err, result) => {
			if (err) return reject(Boom.notFound())
			
			return resolve(result)
		})
	})

const find_request_password_reset = ({server: {db: {r, conn}}, payload: {hash}}) =>
	new Promise(async (resolve, reject) => {
		
		r.table('password_resets').getAll(hash, {index: 'hash'}).run(conn, (err, results) => {
			if (err) return reject(err)
			
			results.toArray((err, rows) => {
				if (err) return reject(err)
				
				return resolve(rows)
			})
		})
		
	})

const get_single_user_password_reset = (r, conn, id) =>
	new Promise((resolve, reject) => {
		r
			.table('users')
			.get(id)
			.run(conn, (err, result) => {
				if (err) return reject(err)
				
				return resolve(result)
			})
	})

module.exports = {
	user_exists,
	get_profiles,
	get_jobs,
	get_each_company_applications,
	verify_account,
	update_verified_user,
	find_request_password_reset,
	get_single_user_password_reset
}