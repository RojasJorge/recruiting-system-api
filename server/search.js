'use strict'

const Promise = require('bluebird')
const _ = require('lodash')

const search = async req =>
	await eval(req.payload.query.name)(req)

const last_companies = ({server: {db: {r, conn}}, payload: {type, query}}) =>
	new Promise(async (resolve, reject) => {
		let Query = r.table(type)
		let Children = r.table('jobs')
		const total = await Query.count().run(conn)
		
		/** Check for limit */
		if (query.variables.limit)
			Query = Query.limit(query.variables.limit)
		
		Query = Query.pluck('id', 'name', 'location').run(conn, (err, results) => {
			if (err) return reject(err)
			
			results.toArray((err, companies) => {
				if (err) return reject(err)
				return resolve(get_total_jobs(r, conn, companies))
			})
		})
	})

const get_total_jobs = (r, conn, companies) =>
	new Promise(
		(resolve, reject) => resolve(Promise.reduce(companies, async (accumulator, currentValue) => {
			currentValue = {
				...currentValue,
				total_jobs: await r.table('jobs').getAll(currentValue.id, {index: 'company_id'}).count().run(conn)
			}
			return [...accumulator, currentValue]
		}, []))
	)

module.exports = search
