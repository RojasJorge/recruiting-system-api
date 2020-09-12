'use strict'

const Promise = require('bluebird')
const Boom = require('@hapi/boom')
const _ = require('lodash')

/**
 * Add user module tools
 */

const user_exists = (req, type = null) => new Promise((resolve, reject) => {
  const {
    server: {
      db: {
        r,
        conn
      }
    }
  } = req

  /** Find user by email */
  r
    .table('users')
    .getAll(req.payload.email, {
      index: 'email'
    })
    // .innerJoin(r.table('profiles'), (users, profiles) => {
    //   return profiles('uid').eq(users('id'))
    // })
    // .map((doc) => {
    //   return doc.merge().doc
    // })
    .run(conn, (err, results) => {
      if (err) return reject(Boom.badGateway())

      results.toArray((err, rows) => {
        if (err) return reject(Boom.badGateway())
        /** Switch resolver */
        return type === 'login' ? resolve(rows) : resolve(_.isEmpty(rows))
      })
    })

})


/**
 * Watch user scope to show/edit contents
 */
const verify_scope = _ =>
  new Promise((resolve, reject) => {
  
  })

module.exports = {
  user_exists
}