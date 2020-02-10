'use strict'

const Promise = require('bluebird')
const config = require('../../../config')
const isEmpty = require('lodash/isEmpty')

module.exports = {
  account: {
    check: (r, conn, email) => new Promise((resolve, reject) =>
      r
      .db(config.get('/db/name'))
      .table('users')
      .getAll(email, {
        index: 'email'
      })
      .run(conn, (error, results) => {
        if (error) return reject(error)
        results.toArray((error, rows) => {
          if (error) return reject(error)
          return resolve(isEmpty(rows))
        })
      })
    ),
    profile: {
      add: (r, conn, o) => new Promise((resolve, reject) =>
        r
        .db(config.get('/db/name'))
        .table('profiles')
        .insert(o)
        .run(conn, (error, result) => {
          if (error) return reject(error)

          /** Returns the new profile id */
          return resolve(result.generated_keys.shift())
        })
      )
    },
    // token: {
    //   refresh: (r, conn, o) => new Promise((resolve, reject) => {
    //     {
    //       console.log('refresh token: ', o);
    //       resolve({
    //         token: 'the token here.'
    //       })
    //     }
    //   })
    // }
  }
}