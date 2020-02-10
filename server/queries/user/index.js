'use strict'

const config = require('../../../config')
const Promise = require('bluebird')
const Boom = require('boom')
var JWT = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const _ = require('lodash')
const helper = require('./helper')

const validate = async (decoded, req) => new Promise((resolve) => {

  /**
   * validate follows the standard for for hapi-auth-jwt2
   * we expect the decoded JWT to have a 'sid' key which has a valid session id.
   * If the sid is in the sessions table of the database and end_timestamp has
   * not been set, (i.e. null), we know the session is valid.
   */

  const r = req.server.db.r
  const conn = req.server.db.conn

  r
    .db(config.get('/db/name'))
    .table('users')
    .get(decoded.id)
    .run(conn, (err, user) => {
      if (err || !user)
        return resolve({
          isValid: false,
          credentials: {}
        })

      delete user.password

      /** Resolve with scopes */
      return resolve({
        isValid: true,
        credentials: {
          scope: user.scopes
        }
      })
    })
})

/** Refresh token */
const refresh = req => new Promise((resolve, reject) => {
  if (typeof req.headers.authorization !== 'undefined') {
    JWT.verify(req.headers.authorization, config.get('/api_secret'), (err, decoded) => {
      if (err) return reject(Boom.unauthorized())

      /** Prepare token */
      delete decoded.iat
      delete decoded.exp

      return resolve(JWT.sign(decoded, config.get('/api_secret'), {
        algorithm: 'HS256',
        expiresIn: "2w"
      }))
    })
  }
})

const login = (r, conn, params) => {
  return new Promise((resolve, reject) => {
    r
      .db(config.get('/db/name'))
      .table('users')
      .getAll(params.email, {
        index: 'email'
      })
      .run(conn, async (err, results) => {
        if (err) reject(err)

        results.toArray((err, rows) => {
          if (err) reject(err)

          if (_.isEmpty(rows)) return reject(Boom.unauthorized('Invalid credentials'))

          /** Get first item from collection */
          let user = _.head(rows)

          /** Separate profile from user object */
          const profile = user.profile
          delete user.profile

          /** Compare the password string -> db user object */
          if (!bcrypt.compareSync(params.password, user.password)) return reject(Boom.unauthorized('Invalid credentials'))

          /** Delete password field before send */
          delete user.password

          /** Prepare token */
          const token = JWT.sign(user, config.get('/api_secret'), {
            algorithm: 'HS256',
            expiresIn: "2w"
          })

          /** Add token to the user object */
          user.token = token
          user.profile = profile
          return resolve(user)
        })
      })
  })
}

const get = (r, conn, req) => {
  return new Promise(async (resolve, reject) => {

    const {
      params,
      query
    } = req

    let Query = r
      .db(config.get('/db/name'))
      .table('users')

    const total = await Query.count().run(conn)

    if (params.id)
      Query = Query.get(params.id)

    if (!params.id)
      Query = Query.filter(query || {})

    Query.run(conn, (err, users) => {
      if (err) reject(err)

      if (!users) return reject(Boom.notFound())

      if (params.id && users) {
        delete users.password
        return resolve(users)
      } else {
        users.toArray((err, rows) => {
          if (err) reject(err)

          return resolve({
            items: _.map(rows, function (o) {
              delete o.password
              return o
            }),
            total
          })
        })
      }
    })
  })
}

const add = (r, conn, user) => {
  return new Promise(async (resolve, reject) => {

    /** Check if account exists */
    if (!await helper.account.check(r, conn, user.email))
      return reject(Boom.locked('Email account already in use.'))

    /** Extract password field from payload */
    const password = user.password

    /** Dete password field from payload */
    delete user.password

    /** Add the new hash as password into payload */
    user.password = bcrypt.hashSync(password, 10)

    r
      .db(config.get('/db/name'))
      .table('users')
      .insert(user)
      .run(conn, async (err, result) => {
        if (err) return reject(err)

        /** Returns the generated user id */
        return resolve({
          uid: result.generated_keys.shift()
        })
      })
  })
}

const update = (r, conn, id, o) =>

  /** Update the requested object based on id */
  new Promise((resolve, reject) => {

    /** Reject if id is missing */
    if (!id) return reject(Boom.forbidden('Entity id is required'))

    console.log("==================user update profile.....", JSON.stringify(o.profile.working, false, 2))
    // return resolve(id)

    r
      .db(config.get('/db/name'))
      .table('users')
      .get(id)
      .update(o || {})
      .run(conn, (err, result) => {
        if (err) reject(err)

        return resolve(result)
      })
  })

module.exports = {
  validate,
  refresh,
  login,
  get,
  add,
  update
}