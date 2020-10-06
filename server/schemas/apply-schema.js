'use strict'

const Joi = require('joi')

const get_id = Joi.object({
	id: Joi.string().min(10).max(36).optional()
})

const get = Joi.object({
	jobId: Joi.string().min(10).max(36).optional(),
	uid: Joi.string().min(10).max(36).optional(),
	status: Joi.boolean().optional()
})

const add = Joi.object({
	uid: Joi.string().min(10).max(36).required(),
	jobId: Joi.string().min(10).max(36).required(),
	status: Joi.boolean().default(true).forbidden(),
	created_at: Joi.date().default(new Date()).forbidden(),
	updated_at: Joi.date().default(new Date()).forbidden()
})

const update = Joi.object({
	status: Joi.boolean().optional()
})

module.exports = {
	get,
	add,
	update
}
