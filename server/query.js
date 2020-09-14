'use strict'

const Promise = require('bluebird')
const Boom = require('@hapi/boom')
const _ = require('lodash')

const get = (req, table) => new Promise(async (resolve, reject) => {
	
	/**
	 * Switch controller to fetch only user's contents
	 */
	// if(_.filter(req.server.current.scopes, o => o !== 'umana')) {
	// 	await get_own_contents(req)
	// }
	
	/** Extract values from request */
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
			page,
			offset
		}
	} = req
	
	
	/** Delete pagination params from query */
	delete req.query.page
	delete req.query.offset
	
	/** Query init as pipe */
	let Query = r.table(table)
	const total = await Query.count().run(conn)
	
	/** Reject if query + id */
	if (!_.isEmpty(req.query) && id)
		return reject(Boom.badRequest("You don't need to filter if you ask for an id"))
	
	/** Check for single row query */
	if (id) {
		Query = Query.get(id)
	} else {
		
		/** Apply filters */
		const start = ((parseInt(page, 10) * parseInt(offset, 10)) - parseInt(offset, 10))
		const end = (start + parseInt(offset, 10))
		
		Query = Query.filter(req.query || {}).slice(start, end)
	}
	
	Query.run(conn, (err, results) => {
		if (err) return reject(Boom.badGateway(err))
		
		/** Map results */
		if (id) {
			return resolve(results)
		} else {
			results.toArray((err, items) => {
				if (err) return reject(Boom.badGateway())
				
				return resolve({items, total})
			})
		}
	})
	
})

const add = (req, table) => new Promise((resolve, reject) =>
	{
		console.log('Add:', req.payload)
		req.server.db.r
			.table(table)
			.insert(req.payload)
			.run(req.server.db.conn, (err, result) => {
				if (err) return reject(Boom.badGateway())
				
				/** Return stored object id */
				const id = result.generated_keys.shift()
				return resolve(id)
			})
	}
)

const update = (req, table) => new Promise((resolve, reject) =>
	req.server.db.r
		.table(table)
		.get(req.params.id)
		.update(req.payload)
		.run(req.server.db.conn, (err, result) => {
			if (err) return reject(Boom.badGateway())
			return resolve(result)
		})
)


/**
 * Get own contents
 */
const get_own_contents = req =>
	new Promise((resolve, reject) => {
		
		return resolve(true)
	})

module.exports = {get, add, update}
