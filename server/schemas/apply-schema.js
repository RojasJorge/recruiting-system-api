'use strict'

const Joi = require('joi')

const get_id = Joi.object({
	id: Joi.string().min(10).max(36).optional()
})

const get_apply_candidate_id = Joi.object({
	id: Joi.string().min(10).max(36).required()
})

const get_apply_candidate = Joi.object({
	// jobId: Joi.string().min(10).max(36).optional(),
	uid: Joi.string().min(10).max(36).optional(),
	// companyId: Joi.string().min(10).max(36).optional(),
	status: Joi.string().valid('PENDING', 'RECEIVED', 'IN_REVIEW', 'CANCELLED', 'SUCCESS').optional(),
	page: Joi.number().default(1).optional(),
	offset: Joi.number().default(10).optional()
})

const get = Joi.object({
	jobId: Joi.string().min(10).max(36).optional(),
	uid: Joi.string().min(10).max(36).optional(),
	companyId: Joi.string().min(10).max(36).optional(),
	status: Joi.string().valid('PENDING', 'RECEIVED', 'IN_REVIEW', 'CANCELLED', 'SUCCESS').optional(),
	page: Joi.number().default(1).optional(),
	offset: Joi.number().default(10).optional()
})

const add = Joi.object({
	uid: Joi.string().min(10).max(36).required(),
	jobId: Joi.string().min(10).max(36).required(),
	companyId: Joi.string().min(10).max(36).required(),
	status: Joi.string().valid('PENDING', 'RECEIVED', 'IN_REVIEW', 'CANCELLED', 'SUCCESS').default('PENDING').optional(),
	created_at: Joi.date().default(new Date()).forbidden(),
	updated_at: Joi.date().default(new Date()).forbidden(),
	mailing: Joi.object().optional()
})

const update = Joi.object({
	status: Joi.string().valid('PENDING', 'RECEIVED', 'IN_REVIEW', 'CANCELLED', 'SUCCESS').required(),
	email: Joi.string().email().optional(),
	name: Joi.string().optional(),
	job: Joi.string().optional(),
	company: Joi.string().optional()
})

module.exports = {
	get_id,
	get_apply_candidate_id,
	get,
	get_apply_candidate,
	add,
	update
}
