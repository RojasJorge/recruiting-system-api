'use strict'

const query = require('../query')
const Boom = require('@hapi/boom')
const helpers = require('../helpers')
const table = 'profiles'

module.exports = {
	update: async (req, h) => {
		if(req.params.uid !== JSON.parse(req.server.current.data).id) return Boom.forbidden()
		const profile = await helpers.get_profiles(req, table)
		
		return h.response(await query.update(req, table))
	}
}
