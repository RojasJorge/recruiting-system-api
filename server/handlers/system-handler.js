'use strict'

const config = require('../../config')
const queries = require('../queries')

const setup = async (req, h) => {
  const r = req.server.db.r
  const conn = req.server.db.conn

  /** Check for required dbs */
  let _response = false
  const dbs = await r.dbList().run(conn)

  if (dbs.indexOf(config.get('/db/name')) !== -1 && dbs.indexOf('rethinkdb') !== -1) {
    _response = true
  } else {

    await r.dbCreate(config.get('/db/name')).run(conn, async (err, results) => {
      if (err) throw err

      /** Register new tables */
      await r.db(config.get('/db/name')).tableCreate('users').run(conn)
      await r.db(config.get('/db/name')).tableCreate('companies').run(conn)
      await r.db(config.get('/db/name')).tableCreate('careers').run(conn)
      await r.db(config.get('/db/name')).tableCreate('jobs').run(conn)
      await r.db(config.get('/db/name')).tableCreate('academic_levels').run(conn)

      /** Indexes */
      await r.db(config.get('/db/name')).table('users').indexCreate('email').run(conn)
      await r.db(config.get('/db/name')).table('careers').indexCreate('parent').run(conn)
      await r.db(config.get('/db/name')).table('jobs').indexCreate('company_id').run(conn)

      console.log('ALL TABLES CREATED!!!')
      return results
    })

    _response = {msg: 'ALL TABLES CREATED!!!'}
  }

  return { db_status: _response }
}

const avatar_get = async (req, h) => h.file(await queries.system.avatar_get(req.query))
const avatar_add = async (req, h) => h.response(await queries.system.avatar_add(req.server.db.r, req.server.db.conn, req.payload))

module.exports = {
  setup,
  avatar_get,
  avatar_add
}