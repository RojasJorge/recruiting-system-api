'use strict'

const matching = require('../matching')

const candidates_to_job = async (req, h) =>
	h.response(await matching.do(req))

module.exports = {
	candidates_to_job
}
