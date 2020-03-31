'use strict'

const config = require('../../../config')
const Promise = require('bluebird')
const Boom = require('boom')
const _table = 'academic_levels'

const get = (r, conn, params) => {
  return new Promise(async (resolve, reject) => {

    const {
      id,
      parent
    } = params

    delete params.id
    delete params.parent

    let Query = r
      .db(config.get('/db/name'))
      .table(_table)

    const total = await Query.count().run(conn)

    if (id) Query = Query.get(id)

    if (parent) Query = Query.getAll(parent, {
      index: 'parent'
    })

    if (!id) Query = Query.filter(params || {})

    Query.run(conn, (err, results) => {
      if (err) reject(err)

      if (!results) return reject(Boom.notFound())

      if (id && results) {
        resolve(results)
      } else {
        results.toArray((err, items) => {
          if (err) resolve(err)
          resolve({items, total})
        })
      }
    })
  })
}

const add = (r, conn, params, owner) => {
  return new Promise(async (resolve) => {
    params.owner = owner
    r
      .db(config.get('/db/name'))
      .table(_table)
      .insert(params)
      .run(conn, (err, result) => {
        if (err) resolve(err)
        /** Return the db result */
        resolve(result)
      })
  })
}

const update = (r, conn, id, params) => {

  /** Update the requested object based on id */
  return new Promise((resolve, reject) => {

    /** Date updated */
    params.updated_at = new Date()

    /** Reject if id is missing */
    if (!id) return reject(Boom.forbidden('Entity id is required'))

    r
      .db(config.get('/db/name'))
      .table(_table)
      .get(id)
      .update(params || {})
      .run(conn, (err, result) => {
        if (err) resolve(err)
        resolve(result)
      })
  })
}

module.exports = {
  get,
  add,
  update
}
