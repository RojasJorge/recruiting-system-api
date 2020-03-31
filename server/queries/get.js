'use strict'

const config = require('../../config')
const Boom = require('@hapi/boom')

const single = (req, table) => new Promise((resolve, reject) => {

  /** DB utils */
  const {
    r,
    conn
  } = req.server.db

  /**
   * Exec query
   */
  r
    .db(config.get('/db/name'))
    .table(table)
    .get(req.params.id || 'o')
    .run(conn, (err, results) => {
      if (err) return reject(Boom.badGateway())
      if (!results) return reject(Boom.notFound())
      return resolve(results)
    })
})

const collection = (req, table) => new Promise(async (resolve, reject) => {

  /** DB utils */
  const {
    r,
    conn
  } = req.server.db

  let Query = r
    .db(config.get('/db/name'))
    .table(table)

  const total = await Query.count().run(conn)

  /** Query params object */
  const {
    query
  } = req

  const page = query.pager.page
  const limit = query.pager.limit

  /** Delete pager from query to prevent filtering errors */
  delete query.pager

  /** Prepare pagination */
  const queryOffset = parseInt(page, 10)
  const pageLimit = parseInt(limit, 10)
  const start = ((queryOffset * pageLimit) - pageLimit)
  const end = start + pageLimit

  Query = Query.filter(query || {}).slice(start, end)

  /**
   * Exec query
   */
  Query.run(conn, (err, results) => {
    if (err) return reject(Boom.badGateway())

    if (!results) return reject(Boom.notFound())

    results.toArray((err, items) => {
      if (err) return reject(Boom.badGateway())

      /** Resolve found items */
      return resolve({
        items,
        total
      })
    })
  })

})

module.exports = {
  single,
  collection
}
