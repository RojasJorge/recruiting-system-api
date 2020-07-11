'use strict'

const query = require('../query')
const bcrypt = require('bcrypt')
const Boom = require('@hapi/boom')
const helpers = require('../helpers')
const _ = require('lodash')
const JWT = require('jsonwebtoken')
const config = require('../../config')
const table = 'users'

module.exports = {
  validate: async (decoded, req) => {
    const user = await req.server.db.r.table('users').get(decoded.id).run(req.server.db.conn)
    if (user) {
      return {
        isValid: true, credentials: {
          scope: user.scope
        }
      }
    } else {
      return { isValid: false }
    }
  },
  login: async (req, h) => {

    /** Request user in db */
    const found = await helpers.user_exists(req, 'login')

    /** Reject if !user */
    if (_.isEmpty(found)) return Boom.unauthorized()

    /** Extract from collection */
    let user = found.shift()

    /** Validate password */
    if (!bcrypt.compareSync(req.payload.password, user.password)) return Boom.unauthorized()

    /** Exclude password from token */
    delete user.password

    user.token = JWT.sign(
      JSON.stringify(user),
      config.get('/app/secret')
    )

    return h.response(user)
  },
  get: async (req, h) => {

    const data = await query.get(req, table)
    data.items = _.map(data.items, o => {
      delete o.password
      return o
    })

    return h.response(data)
  },
  add: async (req, h) => {

    if (!await helpers.user_exists(req)) return Boom.notAcceptable('Account already exists')

    /** Hash the user password */
    req.payload.password = bcrypt.hashSync(req.payload.password, 10, hash => hash)

    return h.response(await query.add(req, table))
  },
  update: async (req, h) => {
    if (!req.params.id) return Boom.badData('Id is required')

    /** If password changed */
    if (req.payload.password)
      req.payload.password = bcrypt.hashSync(req.payload.password, 10, hash => hash)

    return h.response(await query.update(req, table))
  }
}