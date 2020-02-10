'use strict'

const queries = require('../queries/company')

module.exports = {
  /** Standard CRU */
  get: async (req, h) =>
    h.response(await queries.get(req.server.db.r, req.server.db.conn, req.query)),
  add: async (req, h) =>
    h.response(await queries.add(req.server.db.r, req.server.db.conn, req.payload, req.owner)),
  update: async (req, h) =>
    h.response(await queries.update(req.server.db.r, req.server.db.conn, req.payload)),

  /** Careers (Categories) */
  career_get: async (req, h) =>
    h.response(await queries.career_get(req.server.db.r, req.server.db.conn, req.query)),
  career_add: async (req, h) =>
    h.response(await queries.career_add(req.server.db.r, req.server.db.conn, req.payload, req.owner)),
  career_update: async (req, h) =>
    h.response(await queries.career_update(req.server.db.r, req.server.db.conn, req.payload))
}