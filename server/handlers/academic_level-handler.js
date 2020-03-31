'use strict'

const queries = require('../queries/academic_level')
const get = require('../queries/get')

module.exports = {
  get: async (req, h) =>
    h.response(req.params.id ? await get.single(req, 'academic_levels') : await get.collection(req, 'academic_levels')),
  add: async (req, h) =>
    h.response(await queries.add(req.server.db.r, req.server.db.conn, req.payload, req.owner)),
  update: async (req, h) =>
  {
    console.log("log on update", req.params.id, req.payload)
    return h.response(true)
    // h.response(await queries.update(req.server.db.r, req.server.db.conn, req.params.id, req.payload))
  }
}
