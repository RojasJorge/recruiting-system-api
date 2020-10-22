'use strict'

const config = require('./config'),
  server = require('./server')

module.exports = server.start(config.get('/app/host'), config.get('/app/port'))