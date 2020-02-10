'use strict'

const config = require('./config'),
  server = require('./server/server'),
  host = config.get('/app/host'),
  port = config.get('/app/port')

// Start the server with the host and port specified as passed-in arguments
module.exports = server.start(host, port)