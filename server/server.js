'use strict'

const Hapi = require('@hapi/hapi')
const handlers = require('./handlers')
const plugins = require('./plugins')
const routes = require('./routes')
const config = require('../config')
const Path = require('path')
const helpers = require('./queries/helpers')
const changes = require('./changes')

/** Connect to DB */
const r = require('rethinkdb')
const ConnectiontDB = r.connect({
  host: '128.199.162.22',
  port: 28015
})

const start = (host, port) => {
  const server = new Hapi.Server({
    host,
    port,
    routes: {
      cors: true,
      files: {
        relativeTo: Path.join(__dirname, 'public')
      },
      validate: {
        failAction: async (request, h, err) => {
          if (process.env.NODE_ENV === 'production') {
            console.error('ValidationError:', err.message);
            throw Boom.badRequest(`Invalid request payload input`);
          } else {
            console.error(err);
            throw err;
          }
        }
      }
    }
  })

  ConnectiontDB.then(async (conn) => {

    const io = require('socket.io')(server.listener)

    /** Add the new Rethinkdb variables to the server */
    server.comSocket = io
    server.db = {
      r,
      conn
    }

    /** Register the plugins */
    await server.register(plugins)

    await server.views({
      engines: {
        html: require('handlebars')
      },
      relativeTo: __dirname,
      path: __dirname + '/views'
    })

    /** Configure auth strategy */
    await server.auth.strategy('jwt', 'jwt', {
      key: config.get('/api_secret'),
      validate: handlers.user.validate /** validate function defined on user handler */ ,
      verifyOptions: {
        ignoreExpiration: false /** do not reject expired tokens */ ,
        algorithms: ['HS256'] /** specify your secure algorithm */
      }
    })

    /** Define default auth name */
    await server.auth.default('jwt')

    /** Read the token, then pass decoded with user data to handlers */
    await server.ext({
      type: 'onRequest',
      method: async function (request, h) {
        if (request.path !== '/api/v1/login') {
          if (await helpers.system.tokenVerifier(request)) request.owner = await helpers.system.tokenVerifier(request)
        }
        return h.continue
      }
    })

    /** Register all routes */
    await server.route(routes)

    let count = 0

    /** Socket */
    io.on('connection', async (socket) => {

      socket.emit('count', {
        count
      })

      socket.on('increase', () => {
        count++
        io.sockets.emit('count', {count})
      })

      socket.on('decrease', () => {
        count--
        io.sockets.emit('count', {count})
      })

      socket.on('something', (data) => {
        console.log('data', data);

      })
    })

    /** Start the server */
    await server.start()
    console.log('Connected to DB')
    console.log(`Server running at: ${server.info.uri}${config.get('/api_base_path')} - ${new Date()}`)
  })
}


process.on('unhandledRejection', (err) => {
  console.log(err)
  process.exit(1)
});

module.exports = {
  start
}