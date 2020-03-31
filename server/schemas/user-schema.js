'use strict'

const Joi = require('@hapi/joi')

const _login = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().required()
})

const _refresh = Joi.object({
	token: Joi.string().min(100).required()
})

const _get = Joi.object({
	lastname: Joi.string().min(4).max(150).optional(),
	phone: Joi.string().allow([null, '']).max(100).optional(),
	status: Joi.boolean().optional(),
	available: Joi.boolean().optional(),
	pager: Joi.object().keys({
		page: Joi.number().optional(),
		limit: Joi.number().optional(),
	}).default({
		page: 1,
		limit: 10
	}).optional()
})

const _get_id = Joi.object({
	id: Joi.string().min(10).max(36).allow([null, '']).optional()
})

const _add = Joi.object({
	created_at: Joi.date().default(new Date()).forbidden(),
	email: Joi.string().email().required(),
	password: Joi.string().required(),
	name: Joi.string().min(4).max(150).required(),
	lastname: Joi.string().min(4).max(150).required(),
	phone: Joi.string().allow([null, '']).max(100).optional(),
	birthday: Joi.date().default(null).optional(),
	address: Joi.string().allow([null, '']).max(250).optional(),
	scopes: Joi.array().items(Joi.string().min(4).max(20)).allow(null).default(["candidate"]).optional(),
	status: Joi.boolean().default(true).forbidden(),
	available: Joi.boolean().default(true).forbidden(),
	profile: Joi.object().default({}).forbidden()
})

const _update = Joi.object({
	avatar: Joi.string().max(300).allow(null).default("").optional(),
	password: Joi.string().optional(),
	name: Joi.string().min(4).max(150).optional(),
	lastname: Joi.string().min(4).max(150).optional(),
	phone: Joi.string().max(100).optional(),
	birthday: Joi.date().optional(),
	address: Joi.string().max(250).optional(),
	scopes: Joi.array().items(Joi.string().min(4).max(20)).optional(),
	status: Joi.boolean().optional(),
	profile: Joi.any().optional()
})

module.exports = {
	_login,
	_refresh,
	_get,
	_get_id,
	_add,
	_update
}
