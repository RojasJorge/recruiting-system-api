'use strict'

const fetch = require('node-fetch')
const Promise = require('bluebird')
const config = require('../../config')

const confirm = data =>
	new Promise((resolve, reject) => {
		try {
			fetch(  config.get('/mail/server') + '/user/new-account', {
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

const welcome = data =>
	new Promise((resolve, reject) => {
		try {
			fetch(  config.get('/mail/server') + '/user/welcome', {
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
	confirm,
	welcome
}
