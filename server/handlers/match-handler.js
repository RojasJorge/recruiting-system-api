'use strict'

const matching = require('../matching')
const Promise = require('bluebird')

const get_single_job = ({server: {db: {r, conn}}, params: {jobId}}) =>
	new Promise((resolve, reject) => {
		r
			.table('jobs')
			.get(jobId)
			.run(conn, (err, result) => {
				if(err) return reject(err)
				
				return resolve(result)
			})
	})

const candidates_to_job = async (req, h) =>
	h.response(await matching.do(req))

module.exports = {
	candidates_to_job
}
