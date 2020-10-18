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
	
	// console.log('Fields job helper:', req.query)
	
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
	
	/**
	 * This returns rows filtered
	 */
	if (!_.isEmpty(req.query)) Query = Query.filter(doc => map_filters(req, doc))
	
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

/** Map filters */
const map_filters = (req, doc) => {
	const jobposition = _.toLower(req.query.jobposition)
	const title = _.toLower(req.query.title)
	const province = _.toLower(req.query.province)
	const city = _.toLower(req.query.city)
	
	/**
	 * Validate ir order
	 */
	
	if (jobposition && !title && !province && !city)
		return doc('jobposition').downcase().eq(jobposition)
	
	if (jobposition && title && !province && !city)
		return doc('jobposition').downcase().eq(jobposition)
			.and(doc('title').downcase().match(title))
	
	if (jobposition && title && province && !city)
		return doc('jobposition').downcase().eq(jobposition)
			.and(doc('title').downcase().match(title))
			.and(doc('location')('province').downcase().eq(province))
	
	if (jobposition && title && province && city)
		return doc('jobposition').downcase().eq(jobposition)
			.and(doc('title').downcase().match(title))
			.and(doc('location')('province').downcase().eq(province))
			.and(doc('location')('city').downcase().eq(city))
	
	/**
	 * Validate single
	 */
	if (!jobposition && title && !province && !city)
		return doc('title').downcase().match(title)
	
	if (!jobposition && !title && province && !city)
		return doc('location')('province').downcase().eq(province)
	
	if (!jobposition && !title && province && city)
		return doc('location')('province').downcase().eq(province)
			.and(doc('location')('city').downcase().eq(city))
	
	if (jobposition && !title && province && !city)
		return doc('title').downcase().match(title)
			.and(doc('location')('province').downcase().eq(province))
	
	if (jobposition && !title && province && !city)
		return doc('jobposition').downcase().eq(jobposition)
			.and(doc('location')('province').downcase().eq(province))
	
	if (jobposition && !title && province && city)
		return doc('jobposition').downcase().eq(jobposition)
			.and(doc('location')('province').downcase().eq(province))
			.and(doc('location')('city').downcase().eq(city))
	
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
	
	if(scope === 'umana') {
		companies = await new Promise((resolve, reject) => {
			
			let GET_COMPANIES = r.table('companies')
			
			if (companyId) {
				GET_COMPANIES = GET_COMPANIES.get(companyId)
			}
			
			GET_COMPANIES.run(conn, (err, results) => {
				
				if(companyId) return resolve([results])
				
				results.toArray((err, rows) => resolve(rows))
			})
		})
	}
	
	if(scope === 'company') {
		companies = await new Promise((resolve, reject) => {
			
			let GET_COMPANIES = r.table('companies')
			
			if (companyId) {
				GET_COMPANIES = GET_COMPANIES.get(companyId)
			} else {
				GET_COMPANIES = GET_COMPANIES.getAll(cUser.id, {index: 'uid'})
			}
			
			GET_COMPANIES.run(conn, (err, results) => {
				
				if(companyId) return resolve([results])
				
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
					if(jobId) pipe = pipe.and(doc('jobId').eq(jobId))
					
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

module.exports = {
	user_exists,
	get_profiles,
	get_jobs,
	get_each_company_applications
}