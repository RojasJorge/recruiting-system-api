'use strict'

const Joi = require('joi')

const login = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().required()
})

const refresh = Joi.object({
	token: Joi.string().min(100).required()
})

const get = Joi.object({
	name: Joi.string().min(4).max(150).optional(),
	lastname: Joi.string().min(4).max(150).optional(),
	phone: Joi.string().allow(null).max(100).optional(),
	status: Joi.boolean().optional(),
	page: Joi.number().default(1).optional(),
	offset: Joi.number().default(10).optional(),
	profile: Joi.object({
		personal: Joi.object()
	}).optional()
})

const get_id = Joi.object({
	id: Joi.string().min(10).max(36).allow(null, '').optional()
})

const add = Joi.object({
	avatar: Joi.string().max(300).allow(null).default(null).optional(),
	created_at: Joi.date().default(new Date()).forbidden(),
	email: Joi.string().email().required(),
	password: Joi.string().required(),
	name: Joi.string().min(2).max(150).required(),
	lastname: Joi.string().min(2).max(150).required(),
	phone: Joi.string().allow(null, '').max(100).optional(),
	birthday: Joi.date().default(null).optional(),
	address: Joi.string().allow(null).max(250).optional(),
	scope: Joi.array().items(Joi.string().valid('umana', 'admin', 'candidate', 'company')).default(['candidate']).optional(),
	status: Joi.boolean().default(true).forbidden(),
	verified: Joi.string().default('').forbidden()
})

const update = Joi.object({
	avatar: Joi.string().max(300).allow(null).default(null).optional(),
	password: Joi.string().optional(),
	name: Joi.string().min(4).max(150).optional(),
	lastname: Joi.string().min(4).max(150).optional(),
	phone: Joi.string().max(100).optional(),
	birthday: Joi.date().optional(),
	address: Joi.string().max(250).optional(),
	scope: Joi.array().items(Joi.string().valid('umana', 'admin', 'candidate', 'company')).optional(),
	status: Joi.boolean().optional()
})

module.exports = {
	login,
	refresh,
	get,
	get_id,
	add,
	update
}
