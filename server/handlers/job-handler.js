'use strict'

const query = require('../query')
const table = 'jobs'

module.exports = {
  get: async (req, h) =>
    h.response(await query.get(req, table)),
  add: async (req, h) =>
    h.response(await query.add(req, table)),
  update: async (req, h) =>
    h.response(await query.update(req, table))
}