'use strict'

const Joi = require('@hapi/joi')

const _get = Joi.object({
  status: Joi.boolean().optional(),
  pager: Joi.object().keys({
    page: Joi.number().optional(),
    limit: Joi.number().optional(),
  }).default({
    page: 1,
    limit: 10
  }).optional()
})

const _get_id = Joi.object({
  id: Joi.string().min(6).max(36).optional(),
})

const _add = Joi.object({
  created_at: Joi.date().default(new Date()).forbidden(),
  updated_at: Joi.date().default(new Date()).forbidden(),
  name: Joi.string().min(4).max(150).required(),
  status: Joi.boolean().default(true).forbidden(),
  parent: Joi.string().min(6).max(36).allow([null, '']).optional()
})

const _update = Joi.object({
  name: Joi.string().min(4).max(150).optional(),
  status: Joi.boolean().optional(),
  parent: Joi.string().min(6).max(36).allow([null, '']).optional()
})

module.exports = {
  _get,
  _get_id,
  _add,
  _update
}
