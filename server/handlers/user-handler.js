'use strict';

const query = require('../query')
const bcrypt = require('bcrypt')
const Boom = require('@hapi/boom')
const helpers = require('../helpers')
const _ = require('lodash')
const JWT = require('jsonwebtoken')
const config = require('../../config')
const table = 'users'
const mailing = require('../mailing')
const md5 = require('md5')

module.exports = {
	
	
	/**
	 | ---------------------------------------------------------------
	 | VALIDATION HANDLER
	 |
	 | Used by hapi server to check the token (decoded)
	 | & find user based on provided id.
	 | ---------------------------------------------------------------
	 | @param decoded
	 | @param req
	 | @returns {Promise<{credentials: {scope: *}, isValid: boolean}|{credentials: {}, isValid: boolean}>}
	 */
	
	validate: async (decoded, req, h) => {
		// console.log('/server/handlers/user-handler.js: decoded:', decoded)
		const user = await req.server.db.r.table('users')
			.get(JSON.parse(decoded.data).id)
			.run(req.server.db.conn)
		
		if (user) {
			return {
				isValid: true,
				credentials: {
					scope: user.scope[0]
				}
			}
		} else {
			return {isValid: false, credentials: {}}
		}
	},
	
	
	/**
	 | ---------------------------------------------------------------
	 | LOGIN
	 |
	 | Server default login handler
	 | ---------------------------------------------------------------
	 | @param req
	 | @param h
	 | @returns {Promise<Boom<unknown>|*>}
	 */
	
	login: async (req, h) => {
		
		/** Request user in db */
		const found = await helpers.user_exists(req, 'login')
		
		/** Reject if !user */
		if (_.isEmpty(found)) return Boom.unauthorized()
		
		/** Extract from collection */
		let user = found.shift()
		
		/** Reject if !verified */
		if(user.verified.length > 1) return Boom.locked()
		
		const profile = user.profile
		
		/** Validate password */
		if (!bcrypt.compareSync(req.payload.password, user.password)) return Boom.unauthorized()
		
		/** Exclude password from token */
		delete user.password
		delete user.profile
		/** Delete temporary avatar */
		// delete profile.personal.avatar
		
		user = {
			...user,
			profile,
			token: JWT.sign(
				{data: JSON.stringify(user)},
				config.get('/app/secret'),
				{expiresIn: '1d'}
			)
		}
		
		return h.response(user)
	},
	get: async (req, h) => {
		const data = await query.get(req, table)
		
		if (_.find(Object.keys(data), o => o === 'items')) {
			data.items = _.map(data.items, o => {
				delete o.password
				return o
			})
		} else {
			delete data.password
		}
		
		return h.response(data)
	},
	add: async (req, h) => {
		
		if (!await helpers.user_exists(req)) return Boom.notAcceptable('Account already exists')
		
		/** Hash the user password */
		req.payload.password = bcrypt.hashSync(req.payload.password, 10, hash => hash)
		
		/** Add hash verification field */
		const HASH = md5(req.payload.email)
		req.payload.verified = HASH
		
		/** Store new user */
		const stored = await query.add(req, table)
		
		/** Get default profile fields config */
		const fields = require('../profile.json')
		
		/** Declare profile as null */
		let profile = null
		
		/** Store new profile referenced to the user */
		if (stored) {
			profile = await req.server.db.r.table('profiles').insert({uid: stored, fields}).run(req.server.db.conn)
		}
		
		await mailing.user.confirm(Object.assign(req.payload, {id: HASH}))
		
		/**
		 * Return id's of user and profile
		 */
		return h.response({
			id: stored,
			profile_id: profile.generated_keys.shift()
		})
	},
	update: async (req, h) => {
		if (!req.params.id) return Boom.badData('Id is required')
		
		/** If password changed */
		if (req.payload.password)
			req.payload.password = bcrypt.hashSync(req.payload.password, 10, hash => hash)
		
		return h.response(await query.update(req, table))
	},
	
	/** Verify account handler */
	verify: async (req, h) => {
		
		const found = await helpers.verify_account(req, table)
		
		if(_.isEmpty(found)) return Boom.notFound()
		
		const user = found[0]
		
		const updated = await helpers.update_verified_user(req.server.db, user.id)
		
		if(updated.unchanged >= 1 || updated.skipped >= 1) return Boom.locked()
		
		if(updated.replaced >= 1) {
			
			return h.response({
				name: `${user.name} ${user.lastname}`,
				email: user.email
			})
		} else {
			return Boom.notFound()
		}
	}
}
