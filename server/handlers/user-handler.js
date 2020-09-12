'use strict';

const query = require('../query');
const bcrypt = require('bcrypt');
const Boom = require('@hapi/boom');
const helpers = require('../helpers');
const _ = require('lodash');
const JWT = require('jsonwebtoken');
const config = require('../../config');
const table = 'users';

module.exports = {
	validate: async (decoded, req) => {
		const user = await req.server.db.r.table('users').get(decoded.id).run(req.server.db.conn)
		if (user) {
			return {
				isValid: true, credentials: {
					scope: user.scope
				}
			}
		} else {
			return {isValid: false, credentials: {}}
		}
	},
	login: async (req, h) => {
		
		/** Request user in db */
		const found = await helpers.user_exists(req, 'login')
		
		/** Reject if !user */
		if (_.isEmpty(found)) return Boom.unauthorized()
		
		/** Extract from collection */
		let user = found.shift()
		const profile = user.profile
		
		/** Validate password */
		if (!bcrypt.compareSync(req.payload.password, user.password)) return Boom.unauthorized()
		
		/** Exclude password from token */
		delete user.password
		delete user.profile
		/** Delete temporary avatar */
		// delete profile.personal.avatar
		
		user.token = JWT.sign(
			JSON.stringify(user),
			config.get('/app/secret')
		)
		
		user = {...user, profile}
		
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
		
		// console.log("user add payload", req.payload)
		
		if (!await helpers.user_exists(req)) return Boom.notAcceptable('Account already exists')
		
		/** Hash the user password */
		req.payload.password = bcrypt.hashSync(req.payload.password, 10, hash => hash)
		
		console.log('Password:', req.payload.password)
		
		/** Store new user */
		const stored = await query.add(req, table)
		/** Declare profile as null */
		let profile = null
		
		/** Store new profile referenced to the user */
		if(stored) {
			profile = await req.server.db.r.table('profiles').insert({uid: stored}).run(req.server.db.conn)
		}
		
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
	}
}
