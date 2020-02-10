'use strict'

const queries = require('../queries/user')

module.exports = {
  /** Do not use (h.response) for validate func. */
  validate: async (decoded, req) => await queries.validate(decoded, req),
  refresh: async (req, h) =>
    h.response(await queries.refresh(req)),
  login: async (req, h) =>
    h.response(await queries.login(req.server.db.r, req.server.db.conn, req.payload)),
  get: async (req, h) =>
    h.response(await queries.get(req.server.db.r, req.server.db.conn, req)),
  add: async (req, h) =>
    h.response(await queries.add(req.server.db.r, req.server.db.conn, req.payload)),
  update: async (req, h) =>
    h.response(await queries.update(req.server.db.r, req.server.db.conn, req.params.id, req.payload))
}