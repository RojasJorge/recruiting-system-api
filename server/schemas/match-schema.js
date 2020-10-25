'use strict'

const Joi = require('joi')

const candidates_to_job = Joi.object({
	jobId: Joi.string().max(36).required()
})

module.exports = {
	candidates_to_job
}
