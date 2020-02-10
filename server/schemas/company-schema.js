'use strict'

const Joi = require('@hapi/joi')

const _get = Joi.object({
  id: Joi.string().min(6).max(36).optional(),
  name: Joi.string().min(4).max(150).optional(),
  status: Joi.boolean().optional(),
  category: Joi.object().keys({
    id: Joi.string().min(10).max(36).optional(),
    name: Joi.string().min(4).max(150).optional(),
    sub: Joi.object().keys({
      id: Joi.string().min(10).max(36).optional(),
      name: Joi.string().min(4).max(150).optional(),
    }).optional()
  }).optional(),
  contact: Joi.object().keys({
    name: Joi.string().min(4).max(150).optional(),
    phone: Joi.string().max(50).optional(),
    email: Joi.string().email().optional()
  }).optional(),
  location: Joi.object().keys({
    address: Joi.string().max(250).optional(),
    country: Joi.string().max(50).optional(),
    province: Joi.string().max(50).optional(),
    city: Joi.string().max(50).optional(),
    zone: Joi.number().max(25).optional(),
    latitude: Joi.string().min(6).max(20).optional()
  }).optional()
})

const _add = Joi.object({
  created_at: Joi.date().default(new Date()).forbidden(),
  updated_at: Joi.date().default(new Date()).forbidden(),
  avatar: Joi.string().allow([null, '']).default(null).optional(),
  name: Joi.string().min(4).max(150).required(),
  status: Joi.boolean().default(true).forbidden(),
  description: Joi.string().max(4000).allow([null, '']).default(null).optional(),
  employees: Joi.string().max(250).allow([null, '']).optional(),
  experience: Joi.string().max(4000).allow([null, '']).optional(),
  website: Joi.string().max(250).allow([null, '']).default(null).optional(),
  category: Joi.string().allow([null, '']).max(36).optional(),
  subcategory: Joi.string().allow([null, '']).max(36).optional(),
  contact: Joi.object().keys({
    name: Joi.string().min(4).max(150).required(),
    phone: Joi.string().max(50).allow([null, '']).optional(),
    email: Joi.string().email().allow([null, '']).optional()
  }).required(),
  location: Joi.object().keys({
    address: Joi.string().max(250).allow([null, '']).optional(),
    country: Joi.string().max(50).allow([null, '']).optional(),
    province: Joi.string().max(50).allow([null, '']).optional(),
    city: Joi.string().max(50).allow([null, '']).optional(),
    zone: Joi.number().max(25).allow([null, '']).optional(),
    latitude: Joi.string().min(6).max(20).allow([null, '']).default(null).optional(),
    longitude: Joi.string().min(6).max(20).allow([null, '']).default(null).optional()
  }).optional()
})

const _update = Joi.object({
  id: Joi.string().min(6).max(36).required(),
  avatar: Joi.string().max(50).optional(),
  name: Joi.string().min(4).max(150).optional(),
  status: Joi.boolean().optional(),
  description: Joi.string().max(800).allow([null, '']).optional(),
  employees: Joi.string().max(50).allow([null, '']).optional(),
  experience: Joi.string().max(50).allow([null, '']).optional(),
  website: Joi.string().max(250).allow([null, '']).optional(),
  category: Joi.string().allow([null, '']).max(36).optional(),
  subcategory: Joi.string().allow([null, '']).max(36).optional(),
  contact: Joi.object().keys({
    name: Joi.string().min(4).max(150).allow([null, '']).optional(),
    phone: Joi.string().max(50).allow([null, '']).optional(),
    email: Joi.string().email().allow([null, '']).optional()
  }).optional(),
  location: Joi.object().keys({
    address: Joi.string().max(250).allow([null, '']).optional(),
    country: Joi.string().max(50).allow([null, '']).optional(),
    province: Joi.string().max(50).allow([null, '']).optional(),
    city: Joi.string().max(50).allow([null, '']).optional(),
    zone: Joi.number().max(25).allow([null, '']).optional(),
    latitude: Joi.string().min(6).max(20).allow([null, '']).optional(),
    longitude: Joi.string().min(6).max(20).allow([null, '']).optional()
  }).optional()
})

/** Categories */

const _career_get = Joi.object({
  id: Joi.string().min(6).max(36).optional(),
  parent: Joi.string().min(10).max(36).allow([null, '']).optional(),
  slug: Joi.string().optional(),
  status: Joi.boolean().optional(),
}).when(Joi.object({
  id: Joi.exist()
}).unknown(), {
  then: Joi.object({
    parent: Joi.forbidden()
  })
})

const _career_add = Joi.object({
  created_at: Joi.date().forbidden(),
  updated_at: Joi.date().forbidden(),
  name: Joi.string().min(2).max(150).required(),
  status: Joi.boolean().default(true).forbidden(),
  level: Joi.number().integer().default(0).optional(),
  parent: Joi.string().min(10).max(36).allow([null, '']).default(null).optional()
})

const _career_update = Joi.object({
  id: Joi.string().min(6).max(36).required(),
  name: Joi.string().min(2).max(150).required(),
  status: Joi.boolean().optional(),
  parent: Joi.string().min(10).max(36).allow([null, '']).optional()
})

module.exports = {
  _get,
  _add,
  _update,
  _career_get,
  _career_add,
  _career_update,
}