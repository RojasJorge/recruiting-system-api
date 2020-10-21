'use strict'

const fetch = require('node-fetch')
const Promise = require('bluebird')

const confirm = data =>
	new Promise((resolve, reject) => {
		try {
			fetch('http://localhost:30300/new-user', {
				method: 'POST',
				body: JSON.stringify(data),
				headers: {
					'Content-Type': 'application/json'
				}
			})
				.then(res => resolve(res.json()))
				.then(json => console.log(json));
		} catch(err) {
			return reject(err)
		}
	})

module.exports = {
	confirm
}
