import { graphqlHapi, graphiqlHapi } from 'graphql-server-hapi'
import { schema } from './schema'

export default function (server, config) {

  server.register({
    register: graphqlHapi,
    options: {
      path: '/graphql',
      graphqlOptions: { schema }
    }
  })

  server.register({
    register: graphiqlHapi,
    options: {
      path: '/graphiql',
      graphiqlOptions: {
        endpointURL: '/graphql'
      }
    }
  })

}

