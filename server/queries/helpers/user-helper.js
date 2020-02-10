'use strict'

const Promise = require('bluebird')
const config = require('../../../config')

const account_verifier = (r, conn, email) =>
  new Promise((resolve) => {
    r
      .db(config.get('/db/name'))
      .table('users')
      .getAll(email, {
        index: 'email'
      })
      .run(conn, (err, results) => {
        if (err) resolve(err)

        results.toArray((err, rows) => {
          if (err) resolve(err)
          resolve(rows)
        })
      })
  })

module.exports = {
  account_verifier /** Prevent email duplicates */ ,
}