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
				.map(doc => {
					return doc.merge(_ => {
						return doc.merge({
							'profile': doc('right'),
							'job': doc('left')
						})
					})
				})
				.without('left')
				.without('right')
				.run(conn, (err, results) => {
					if(err) return reject(Boom.badGateway())
					
					results.toArray((err, rows) => {
						console.log('Rows:', rows)
						if(err) return reject(Boom.badGateway())
						
						return resolve(rows)
					})
				})
		})
}
