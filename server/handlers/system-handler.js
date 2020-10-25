'use strict'

const Promise = require('bluebird')
const JWT = require('jsonwebtoken')
const Boom = require('@hapi/boom')
const config = require('../../config')
// const queries = require('../queries')

const setup = async (req, h) => {
	const r = req.server.db.r
	const conn = req.server.db.conn
	
	/** Check for required dbs */
	let _response = false
	const dbs = await r.dbList().run(conn)
	
	if (dbs.indexOf(config.get('/db/name')) !== -1 && dbs.indexOf('rethinkdb') !== -1) {
		_response = true
	} else {
		
		await r.dbCreate(config.get('/db/name')).run(conn, async (err, results) => {
			if (err) throw err
			
			/** Register new tables */
			await r.db(config.get('/db/name')).tableCreate('users').run(conn)
			await r.db(config.get('/db/name')).tableCreate('companies').run(conn)
			await r.db(config.get('/db/name')).tableCreate('careers').run(conn)
			await r.db(config.get('/db/name')).tableCreate('jobs').run(conn)
			await r.db(config.get('/db/name')).tableCreate('academic_levels').run(conn)
			
			/** Indexes */
			await r.db(config.get('/db/name')).table('users').indexCreate('email').run(conn)
			await r.db(config.get('/db/name')).table('careers').indexCreate('parent').run(conn)
			await r.db(config.get('/db/name')).table('jobs').indexCreate('company_id').run(conn)
			
			console.log('ALL TABLES CREATED!!!')
			return results
		})
		
		_response = {msg: 'ALL TABLES CREATED!!!'}
	}
	
	return {db_status: _response}
}

/**
 * Check user scope & adds restrictions
 */
const add_scope = req =>
	new Promise(async (resolve, reject) => {
		
		try {
			
			/** Verify token before attach it on server */
			const decoded = JWT.verify(req.headers.authorization, config.get('/app/secret'))
			
			/** Reject if token has expired */
			if (!decoded) return reject(Boom.unauthorized())
			
			/** Fetch user in database using decoded id */
			const user = await req.server.db.r.table('users').get(JSON.parse(decoded.data).id).run(req.server.db.conn)
			
			/** Reject if !user */
			if (!user) return reject(Boom.unauthorized())
			
			/** Return decoded info to attach */
			return resolve(decoded)
			
			
		} catch (err) {
			
			/** Prevent crash */
			return resolve()
		}
		
	})

module.exports = {
	add_scope
}
