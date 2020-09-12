'use strict'

const Joi = require('joi')

const avatar_get = Joi.object({
	filename: Joi.string().max(50).optional()
})

const avatar_add = Joi.object({
	entity_id: Joi.string().max(250).required(),
	media: Joi.string().dataUri().required(),
	module: Joi.string().valid('companies', 'users', 'jobs').required()
})

const search = Joi.object({
	type: Joi.string().valid('companies', 'users', 'jobs', 'careers'),
	query: Joi.object({
		name: Joi.string().allow(null).optional(),
		variables: Joi.object({
			limit: Joi.number().allow(null).optional(),
			term: Joi.string().min(3).max(50).optional()
		})
	})
})

const search_table_schema = [{
	table: "users",
	fields: ["id", "name", "lastname", "email", "dpi"]
}, {
	table: "companies",
	fields: ["id", "name", "phone"]
}, {
	table: "jobs",
	fields: ["id", "company_id", "availability", "title", "workplace"]
}]

module.exports = {
	avatar_get,
	avatar_add,
	search,
	search_table_schema
}