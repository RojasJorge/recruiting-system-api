'use strict'

const config = require('../config')

let plugins = [
  require('hapi-auth-jwt2').plugin,
  require('@hapi/inert').plugin,
  require('@hapi/vision').plugin
]

if (JSON.parse(config.get('/app/secure')))
  plugins.push({
    plugin: require('hapi-require-https'),
    options: {}
  })

module.exports = plugins