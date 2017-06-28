import * as Hapi from 'hapi'
import User from './controllers/user.controller'
import Graphql from './graphql'

export function init(config): Promise<Hapi.Server> {
  return new Promise((resolve) => {

    const port = process.env.port || config.server.port
    const server = new Hapi.Server()

    server.connection({
      host: 'localhost',
      port,
      routes: {
        cors: true
      }
    })

    server.register(require('hapi-auth-jwt'), (err) => {

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