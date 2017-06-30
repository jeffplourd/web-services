import * as Hapi from 'hapi'
import User from './controllers/user.controller'
import Graphql from './graphql'

export function init(config): Promise<Hapi.Server> {
  return new Promise(resolve => {
    const port = process.env.port || config.server.port
    const server = new Hapi.Server()

    const connection = {
      port,
      routes: {
        cors: true
      }
    }

    if (process.env.NODE_ENV === 'development') {
      connection['host'] = 'localhost'
    }

    server.connection(connection)

    server.register(require('hapi-auth-jwt'), err => {
      // We are giving the strategy a name of 'jwt'
      server.auth.strategy('jwt', 'jwt', 'required', {
        key: config.server.secret,
        verifyOptions: { algorithms: ['HS256'] }
      })

      Graphql(server, config)
      User(server, config)

      resolve(server)
    })
  })
}
