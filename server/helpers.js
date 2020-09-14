'use strict'

const Promise = require('bluebird')
const Boom = require('@hapi/boom')
const _ = require('lodash')

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
	
	console.log('user_exists:', req.payload)
	
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

const get_profiles = ({server: {db: {r, conn}}, params: {id, uid}}, table) =>
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
 * Watch user scope to show/edit contents
 */
const verify_scope = _ =>
	new Promise((resolve, reject) => {
	
	})

module.exports = {
	user_exists,
	get_profiles
}