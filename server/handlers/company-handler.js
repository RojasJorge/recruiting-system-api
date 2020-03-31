'use strict'

const queries = require('../queries/company')
const get = require('../queries/get')

module.exports = {
  /** Standard CRU */
  get: async (req, h) =>
    h.response(req.params.id ? await get.single(req, 'companies') : await get.collection(req, 'companies')),
  add: async (req, h) =>
    h.response(await queries.add(req.server.db.r, req.server.db.conn, req.payload, req.owner)),
  update: async (req, h) =>
    h.response(await queries.update(req.server.db.r, req.server.db.conn, req.payload)),

  /** Careers (Categories) */
  career_get: async (req, h) =>
    h.response(req.params.id ? await get.single(req, 'careers') : await get.collection(req, 'careers')),
  career_add: async (req, h) =>
    h.response(await queries.career_add(req.server.db.r, req.server.db.conn, req.payload, req.owner)),
  career_update: async (req, h) =>
    h.response(await queries.career_update(req.server.db.r, req.server.db.conn, req.params.id, req.payload))
}
