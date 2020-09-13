'use strict'

const query = require('../query')
const table = 'profiles'

module.exports = {
	update: async (req, h) => {
		
		return h.response(await query.update(req, table))
	}
}
