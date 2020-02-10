'use strict'

module.exports = [
  require('hapi-auth-jwt2').plugin,
  require('@hapi/inert').plugin,
  require('@hapi/vision').plugin
]