'use strict'

const Hapi = require('@hapi/hapi')
const handlers = require('./handlers')
const plugins = require('./plugins')
const config = require('../config')
const Boom = require('@hapi/boom')
const Fs = require('fs')
// const Promise = require('bluebird')

/** Connect to DB */
const r = require('rethinkdb')

const ConnectiontDB = r.connect({
	host: 'localhost',
	port: 28015,
	db: config.get('/db/name'),
})

const start = (host, port) => {
	
	let options = {
		host,
		port,
		routes: {
			// cors: true,
			cors: {
				origin: [process.env.APP_TRUST]
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
	}
	
	/** Attach tls config if env is production */
	if (JSON.parse(config.get('/api/secure'))) {
		options.tls = {
			key: Fs.readFileSync('/etc/letsencrypt/live/staging.umana.co/privkey.pem'),
			cert: Fs.readFileSync('/etc/letsencrypt/live/staging.umana.co/fullchain.pem')
		}
	}
	
	let server = Hapi.server(options)
	
	ConnectiontDB.then(async (conn) => {
		
		/** Add the new Rethinkdb variables to the server */
		server.db = {
			r,
			conn
		}
		
		/** Register the plugins */
		await server.register(plugins)
		
		/** Configure auth strategy */
		await server.auth.strategy('jwt', 'jwt', {
			key: config.get('/app/secret'),
			validate: handlers.user.validate /** validate function defined on user handler */,
			verifyOptions: {
				ignoreExpiration: false /** do not reject expired tokens */,
				algorithms: ['HS256'] /** specify your secure algorithm */
			}
		})
		
		/** Define default auth name */
		await server.auth.default('jwt')
		
		/** Read the token, then pass decoded with user data to handlers */
		await server.ext({
			type: 'onRequest',
			method: async (request, h) => {
				
				/** Exclude paths from scope validation */
				if (
					// request.headers.authorization &&
					request.path !== '/api/v1/academic-level' &&
					request.path !== '/api/v1/career' &&
					request.path !== '/api/v1/job' &&
					request.path !== '/api/v1/user' &&
					request.path !== '/api/v1/login' &&
					request.path !== '/api/v1/reset-password') {
					
					/** Attach decoded user to the server instance */
					request.server.current = await handlers.system.add_scope(request)
				}
				
				return h.continue
			}
		})
		
		/** Register all routes */
		await server.route(require('./routes'))
		
		/** Start the server */
		await server.start()
		
		// const cursor = await server.db.r.table('chats').changes().run(server.db.conn)
		
		/**
		 * Sockets
		 */
		// const io = require('socket.io')(server.listener)
		//
		// io.on('connection', async socket => {
		// 	console.log('User connected Hapijs server...')
		//
		// 	cursor.each(async (err, data) => {
		// 		console.log('DAta:', data)
		// 		io.sockets.emit('session start', {data: data.new_val})
		// 	})
		//
		// })
		
		console.log(`Server running at: ${server.info.uri}${config.get('/api/base_path')}`)
	})
	

}

process.on('unhandledRejection', err => {
	console.log(err)
	process.exit(1)
})

module.exports = {
	start,
}
