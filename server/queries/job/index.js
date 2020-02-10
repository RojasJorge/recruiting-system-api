'use strict'

const config = require('../../../config')
const Promise = require('bluebird')
const Boom = require('boom')
const _table = 'jobs'

const get = (r, conn, params) => {
  return new Promise((resolve, reject) => {

    const {
      id,
      company_id
    } = params

    delete params.id
    delete params.company_id

    let Query = r
      .db(config.get('/db/name'))
      .table(_table)

    if (id) {
      /** Get only by id */
      Query = Query.get(id)
    } else if(!id && company_id) {
      /** Get by index */
      Query = Query.getAll(company_id, {index: 'company_id'})
    } else {
      /** Next filters */
      Query = Query.filter(params || {})
    }

    Query.run(conn, (err, results) => {
      if (err) reject(err)

      if (!results) return reject(Boom.notFound())

      if (id && results) {
        resolve(results)
      } else {
        results.toArray((err, rows) => {
          if (err) resolve(err)
          resolve(rows)
        })
      }
    })
  })
}

const add = (r, conn, params, owner) => {
  return new Promise(async (resolve, reject) => {
    params.owner = owner
    r
      .db(config.get('/db/name'))
      .table(_table)
      .insert(params)
      .run(conn, (err, result) => {
        if (err) reject(err)
        /** Return the db result */
        resolve(result)
      })
  })
}

const update = (r, conn, params) => {

  /** Update the requested object based on id */
  return new Promise((resolve, reject) => {

    const id = params.id
    delete params.id /** Delete from params (payload) */

    /** Date updated */
    params.updated_at = new Date()

    r
      .db(config.get('/db/name'))
      .table(_table)
      .get(id)
      .update(params || {})
      .run(conn, async (err, result) => {
        if (err) reject(err)

        let status = ''

        if(result.deleted > 0) status = 'deleted'
        if(result.inserted > 0) status = 'inserted'
        if(result.replaced > 0) status = 'updated'
        if(result.skipped > 0) status = 'skipped'
        if(result.unchanged > 0) status = 'unchanged'

        return resolve({
          message: `Item [${id}] has been ${status}`
        })
      })
  })
}

module.exports = {
  get,
  add,
  update
}