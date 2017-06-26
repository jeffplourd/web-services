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

    Graphql(server, config)
    User(server, config)

    resolve(server)

  })
}