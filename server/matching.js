'use strict'

const Promise = require('bluebird')

module.exports = {
	do: ({server: {db: {r, conn}}, query: {ids, multiple}}, h) =>
		new Promise((resolve, reject) => {
			r
				.table('jobs')
				.eqJoin('')
		})
}