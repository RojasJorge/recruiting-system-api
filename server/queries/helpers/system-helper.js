'use strict'

const config = require('../../../config')
const JWT = require('jsonwebtoken')
const Promise = require('bluebird')

const tokenVerifier = (request) => {
  let userData = null
  const token = request.headers.authorization
  if (request.method === 'post' || request.method === 'put' || request.method === 'delete') {
    JWT.verify(token, config.get('/api_secret'), function (err, decoded) {
      if (err || !decoded) return userData = null
      userData = {
        email: decoded.email,
        name: decoded.name,
        lastname: decoded.lastname,
        phone: decoded.phone ? decoded.phone : "0000-0000",
        id: decoded.id,
        scopes: decoded.scopes
      }
    })
  }
  return userData
}

const avatar_updater = (r, conn, data) => {
  return new Promise((resolve, reject) => {
    r
      .db(config.get('/db/name'))
      .table(data.module)
      .get(data.entity)
      .update({avatar: data.filename})
      .run(conn, (err, result) => {
        if(err) resolve(err)
        resolve({success: 'The avatar has been updated successfully.'})
      })
  })
}

module.exports = {
  tokenVerifier,
  avatar_updater
}