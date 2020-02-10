'use strict'

const queries = require('../queries/job')

module.exports = {
  get: async (req, h) =>
    h.response(await queries.get(req.server.db.r, req.server.db.conn, req.query)),
  add: async (req, h) =>
    h.response(await queries.add(req.server.db.r, req.server.db.conn, req.payload, req.owner)),
  update: async (req, h) =>
    h.response(await queries.update(req.server.db.r, req.server.db.conn, req.payload))
}