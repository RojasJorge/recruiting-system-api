'use strict'

const query = require('../query')

module.exports = {
  get: async (req, h) =>
    h.response(await query.get(req, 'companies')),
  add: async (req, h) => {
    console.log('Company payload:', req)
    return h.response(true)
    // return h.response(await query.add(req, 'companies'))
  },
  update: async (req, h) =>
    h.response(await query.update(req, 'companies')),

  /** Careers (Categories) */
  career_get: async (req, h) =>
    h.response(await query.get(req, 'careers')),
  career_add: async (req, h) =>
    h.response(await query.add(req, 'careers')),
  career_update: async (req, h) =>
    h.response(await query.update(req, 'careers'))
}
