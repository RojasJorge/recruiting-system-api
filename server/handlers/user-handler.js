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
const Promise = require('bluebird')

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
		if (_.isEmpty(found)) return Boom.notFound()
		
		/** Extract from collection */
		let user = found.shift()
		
		/** Reject if !verified */
		if (typeof user.verified !== 'undefined' && user.verified.length > 1) return Boom.locked()
		
		/** Subtract profile to sign token */
		const profile = user.profile
		
		/** Validate password */
		if (!bcrypt.compareSync(req.payload.password, user.password)) return Boom.unauthorized()
		
		/** Exclude password from token */
		delete user.password
		delete user.profile
		
		user = {
			...user,
			profile,
			token: JWT.sign(
				{data: JSON.stringify(user)},
				config.get('/app/secret'),
				{expiresIn: '1w'}
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
		let fields = require('../profile.json')
		
		fields.personal.name = req.payload.name
		fields.personal.lastname = req.payload.lastname
		fields.personal.email = req.payload.email
		
		/** Declare profile as null */
		let profile = null
		
		/** Store new profile referenced to the user */
		if (stored) profile = await req.server.db.r.table('profiles').insert({uid: stored, fields}).run(req.server.db.conn)
		
		await mailing.user.confirm(Object.assign(req.payload, {id: HASH}))
		
		/**
		 * Return id's of user and profile
		 */
		return h.response({
			id: stored,
			profile_id: profile.generated_keys.shift()
		})
	},
	
	
	/** Simple update handler */
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
		
		if (_.isEmpty(found)) return Boom.notFound()
		
		const user = found[0]
		
		const updated = await helpers.update_verified_user(req.server.db, user.id)
		
		if (updated.unchanged >= 1 || updated.skipped >= 1) return Boom.locked()
		
		if (updated.replaced >= 1) {
			
			await mailing.user.welcome({email: user.email, name: user.name})
			
			return h.response({
				name: `${user.name} ${user.lastname}`,
				email: user.email
			})
		} else {
			return Boom.notFound()
		}
	},
	
	request_password_reset: async (req, h) => {
		
		const found = await helpers.user_exists(req, 'login')
		
		if (_.isEmpty(found)) return Boom.notFound()
		
		let user = found.shift()
		
		const hash = md5(user.id + new Date())
		
		const data = {
			hash,
			uid: user.id,
			createdAt: new Date(),
			updatedAt: new Date(),
			status: 'PENDING'
		}
		
		const requested = await new Promise((resolve) => {
			req.server.db.r
				.table('password_resets')
				.getAll(user.id, {index: 'uid'})
				.run(req.server.db.conn, (err, results) => {
					if (err) return []
					
					results.toArray((err, rows) => {
						if (err) return []
						
						return resolve(rows)
					})
				})
		})
		
		if (_.isEmpty(requested)) {
			await req.server.db.r.table('password_resets').insert(data).run(req.server.db.conn)
		} else {
			await req.server.db.r.table('password_resets').get(requested[0].id).update({
				updatedAt: new Date(),
				hash,
				status: 'PENDING'
			}).run(req.server.db.conn)
		}
		
		return h.response(await mailing.user.resetPassword({email: user.email, hash}))
	},
	
	/** Forgot password */
	reset_password: async (req, h) => {
		
		const found = await helpers.find_request_password_reset(req)
		
		if (_.isEmpty(found)) return Boom.notFound('Request password reset not found')
		
		const user = await helpers.get_single_user_password_reset(req.server.db.r, req.server.db.conn, found[0].uid)
		
		if (!user) return Boom.notFound('User not found')
		
		/** Reset the password */
		await req.server.db.r.table('users').get(user.id).update({password: bcrypt.hashSync(req.payload.password, 10, hash => hash)}).run(req.server.db.conn)
		
		/** Change status to the current password reset request */
		await req.server.db.r.table('password_resets').get(found[0].id).update({
			updatedAt: new Date(),
			status: 'DONE',
			hash: ''
		}).run(req.server.db.conn)
		
		return h.response({message: 'Password was updated successfully.'})
	},
	
	/**
	 * Company invites users to requests it's jobs
	 */
	invite_a_user: async (req, h) => {
		
		/**
		 * Get entities
		 */
		const profile = await req.server.db.r.table('profiles').get(req.payload.profileId).run(req.server.db.conn)
		const company = await req.server.db.r.table('companies').get(req.payload.companyId).run(req.server.db.conn)
		const job = await req.server.db.r.table('jobs').get(req.payload.jobId).run(req.server.db.conn)
		
		/**
		 * An empty result
		 * @type {{}}
		 */
		let sent = {}
		
		/**
		 * Check for the entities
		 */
		if(profile && company && job) {
			
			/**
			 * Store the new record
			 */
			await req.server.db.r.table('invites').insert({
				company,
				job,
				profile,
				createdAt: req.server.db.r.now(),
				updatedAt: req.server.db.r.now()
			}).run(req.server.db.conn)
			
			/**
			 * Notify user via email
			 */
			sent = await mailing.user.inviteAUser({
				name: profile.fields.personal.name,
				company: company.name,
				email: profile.fields.personal.email,
				job: job.title,
				id: job.id
			})
		}
		
		return h.response(sent)
	},
	
	getInvites: async (req, h) => {
		const invites = () => new Promise(async (resolve, reject) => {
			let Query = req.server.db.r
				.table('invites')
				.filter((doc) => {
					return doc('profile')('id').eq(req.query.profileId)
						.and(doc('company')('id').eq(req.query.companyId))
						.and(doc('job')('id').eq(req.query.jobId))
				})
				const total = await Query.count().run(req.server.db.conn)
				
				Query.run(req.server.db.conn, (err, results) => {
					if(err) return reject(Boom.notFound())
					
					results.toArray((err, items) => {
						if(err) return reject(Boom.notFound())
						
						if(typeof req.query.withDetails !== 'undefined' && !req.query.withDetails) return resolve({items: [], total})
						
						return resolve({items, total})
					})
				})
		})
		
		return h.response(await invites())
	}
}

