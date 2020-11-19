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
				.then(json => console.log(json))
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
				.then(json => console.log(json))
		} catch(err) {
			return reject(err)
		}
	})

const resetPassword = data =>
	new Promise((resolve, reject) => {
		try {
			fetch(  config.get('/mail/server') + '/user/reset-password', {
				method: 'POST',
				body: JSON.stringify(data),
				headers: {
					'Content-Type': 'application/json'
				}
			})
				.then(res => resolve(res.json()))
				.then(json => console.log(json))
		} catch(err) {
			return reject(err)
		}
	})

const requestChange = data =>
	new Promise((resolve, reject) => {
		try {
			fetch(  config.get('/mail/server') + '/user/request-change', {
				method: 'POST',
				body: JSON.stringify(data),
				headers: {
					'Content-Type': 'application/json'
				}
			})
				.then(res => resolve(res.json()))
				.then(json => console.log(json))
		} catch(err) {
			return reject(err)
		}
	})

const newRequest = data =>
	new Promise((resolve, reject) => {
		try {
			fetch(  config.get('/mail/server') + '/user/new-request', {
				method: 'POST',
				body: JSON.stringify(data),
				headers: {
					'Content-Type': 'application/json'
				}
			})
				.then(res => resolve(res.json()))
				.then(json => console.log(json))
		} catch(err) {
			return reject(err)
		}
	})

const newRequestCc = data =>
	new Promise((resolve, reject) => {
		try {
			fetch(  config.get('/mail/server') + '/user/new-request-cc', {
				method: 'POST',
				body: JSON.stringify(data),
				headers: {
					'Content-Type': 'application/json'
				}
			})
				.then(res => resolve(res.json()))
				.then(json => console.log(json))
		} catch(err) {
			return reject(err)
		}
	})

const inviteAUser = data =>
	new Promise((resolve, reject) => {
		try {
			fetch(  config.get('/mail/server') + '/user/invite-a-user', {
				method: 'POST',
				body: JSON.stringify(data),
				headers: {
					'Content-Type': 'application/json'
				}
			})
				.then(res => resolve(res.json()))
				.then(json => console.log(json))
		} catch(err) {
			return reject(err)
		}
	})

module.exports = {
	confirm,
	welcome,
	resetPassword,
	requestChange,
	newRequest,
	newRequestCc,
	inviteAUser
}
