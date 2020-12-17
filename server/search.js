'use strict'

const Promise = require('bluebird')
const _ = require('lodash')
const schemes = require('./schemas')
const Boom = require('@hapi/boom')


/**
 * Parse method name
 * @param req
 * @param h
 * @returns {Promise<*>}
 */
const search = async (req, h) =>
	h.response(await eval(req.payload.query.name)(req))

const last_companies = ({server: {db: {r, conn}}, payload: {type, query}}) =>
	new Promise(async (resolve, reject) => {
		let Query = r.table(type)
		let Children = r.table('jobs')
		const total = await Query.count().run(conn)
		
		/** Check for limit */
		if (query.variables.limit)
			Query = Query.limit(query.variables.limit)
		
		/** Run the query */
		Query = Query.pluck('id', 'name', 'location')
			.run(conn, (err, results) => {
				if (err) return reject(err)
				
				results.toArray((err, companies) => {
					if (err) return reject(err)
					return resolve(get_total_jobs(r, conn, companies))
				})
			})
	})


/**
 * This handler returns a collection of tables
 * found based on term query
 * @param r
 * @param conn
 * @param query
 * @returns {Promise<T | Boom<unknown>>}
 */
const term_in_tables = ({server: {db: {r, conn}}, payload: {query}}) =>
	Promise.reduce(schemes.system.search_table_schema, (acc, current) => {
		return new Promise(async (resolve, reject) => {
			/** DB query */
			await r
				.table(current.table)
				.filter(doc => {
					/** Extract fields from current iteration */
					const {fields} = current
					// console.log('TERM, QUERY', )
					/** Init query */
					let pipe = doc(fields[0]).downcase().eq(query.variables.term)
					// let pipe = doc(fields[0]).downcase().match(`(?i)^${query.variables.term}$`)
					
					/** Find DB matches based on term param */
					if (fields.length > 0) {
						for (const i in fields) {
							pipe = pipe.or(doc(fields[i]).downcase().match(`${query.variables.term}`))
						}
					}
					
					return pipe
				})
				.limit(query.variables.limit || 5)
				.run(conn, (err, result) => {
					if (err) return reject(err)
					
					/** Map rows */
					return result.toArray((err, rows) => {
						if (err) return reject(err)
						
						/** Adds row results into each module name */
						acc[current.table] = rows
						return resolve(acc)
					})
				})
		})
	}, {} /** We get an object like {users: [...], companies: [...]} */)
		.then(result => result)
		.catch(err => new Boom.badImplementation('Scheme error'))


/**
 * Helpers
 * @param r
 * @param conn
 * @param companies
 * @returns {Promise}
 */
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

const eliminarDiacriticos = (texto) => {
	return texto.normalize('NFD').replace(/[\u0300-\u036f]/g,"");
}


module.exports = search
