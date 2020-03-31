'use strict'

const config = require('../../../config')
const Promise = require('bluebird')
const Boom = require('boom')
const slugify = require('slugify')
const _table = 'companies'
const _careers = 'careers'

const all = (r, conn, req) => {
  return new Promise((resolve, reject) => {
    r
      .db('umana')
      .table('companies')
      .run(conn, (error, results) => {
        if (error) throw Boom.badData()

        results.toArray((error, rows) => {
          if (error) throw Boom.badData()

          /** Socket */
          // req.server.io.on('connection', async (socket) => {
          //   socket.emit('getCompanies', {
          //     rows
          //   })
          // })
          return resolve(rows)
        })
      })
  })
}

const get = req =>
  new Promise(async (resolve, reject) => {

  

  
  })


const add = (r, conn, params, owner) => {
  return new Promise(async (resolve) => {

    /** Set the owner */
    params.owner = owner

    /** Set created_at field */
    params.created_at = r.now().inTimezone('-06:00')

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

const update = (r, conn, params) => {

  /** Update the requested object based on id */
  return new Promise((resolve, reject) => {

    const id = params.id
    delete params.id /** Delete from params (payload) */

    /** Date updated */
    params.updated_at = r.now().inTimezone('-06:00')

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

/**
 * Categories
 */

const career_get = (r, conn, params) => {
  return new Promise(async (resolve, reject) => {

    const {
      id,
      parent
    } = params

    delete params.id
    delete params.parent

    let Query = r
      .db(config.get('/db/name'))
      .table(_careers)

    const total = await Query.count().run(conn)

    if (id) Query = Query.get(id)

    if (parent) Query = Query.getAll(parent, {
      index: 'parent'
    })

    if (!id) Query = Query.filter(params || {})

    Query.run(conn, (err, results) => {
      if (err) reject(err)

      if (!results) return reject(Boom.notFound())

      if (id) {
        return resolve(results)
      } else {
        results.toArray((err, items) => {
          if (err) resolve(err)
          return resolve({
            items,
            total
          })
        })
      }
    })
  })
}

const career_add = (r, conn, params, owner) => {
  return new Promise(async (resolve) => {

    /** Set owner */
    params.owner = owner

    /** Set created_at field */
    params.created_at = r.now().inTimezone('-06:00')

    /** Set category slug */
    params.slug = slugify(params.name, {
      replacement: '-',
      remove: null,
      lower: true
    })

    r
      .db(config.get('/db/name'))
      .table(_careers)
      .insert(params)
      .run(conn, (err, result) => {
        if (err) resolve(err)
        /** Return the db result */
        resolve(result)
      })
  })
}

const career_update = (r, conn, id, params) => {
  
  console.log("update category ['career']", params)

  /** Date updated */
  params.updated_at = new Date()

  /** Reject if id is missing */
  if (!id) resolve(Boom.badRequest("Id param is required"))

  /** Update the requested object based on id */
  return new Promise((resolve) => {
    r
      .db(config.get('/db/name'))
      .table(_careers)
      .get(id)
      .update(params || {})
      .run(conn, (err, result) => {
        if (err) resolve(err)
        resolve(result)
      })
  })
}

module.exports = {
  all,
  get,
  add,
  update,
  /** Categories */
  career_get,
  career_add,
  career_update
}
