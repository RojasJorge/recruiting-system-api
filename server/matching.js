'use strict'

const Boom = require('@hapi/boom')

module.exports = {
	do: ({server: {db: {r, conn}}, params: {jobId}}) =>
		new Promise((resolve, reject) => {
			r
				.table('jobs')
				.filter({
					id: jobId
				})
				.innerJoin(r.table('profiles'), (jobs, profiles) => {
					return profiles('fields')('personal')('currentJobTitle').eq(jobs('jobposition'))
				})
				.eqJoin(r.row('left')('company_id'), r.table('companies'))
				.map(doc => {
					return doc.merge(_ => {
						return doc.merge({
							'profile': doc('left')('right'),
							'job': doc('left')('left'),
							'company': doc('right')
						})
					})
				})
				.without('left')
				.without('right')
				.run(conn, (err, results) => {
					if(err) return reject(Boom.badGateway())
					
					results.toArray((err, rows) => {
						if(err) return reject(Boom.badGateway())
						
						return resolve(rows)
					})
				})
		})
}
