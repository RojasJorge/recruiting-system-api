'use strict'

/** Connect to DB */
const r = require('rethinkdb')
const ConnectiontDB = r.connect()
const Promise = require('bluebird')
const Boom = require('@hapi/boom')

const companies = () => {
  return new Promise((resolve) => {
    ConnectiontDB.then(async (conn) => {
      r
        .db('umana')
        .table('companies')
        .run(conn, (error, cursor) => {
          if(error) throw Boom.badData()

          cursor.toArray((error, rows) => {
            console.log(':::::::::::::::CURSOR:::::::::::::::::', rows)
            return resolve(rows)
          })
        })
    })
  })
}

module.exports = {
  companies
}