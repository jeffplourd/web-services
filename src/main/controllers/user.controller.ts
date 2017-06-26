import * as Hapi from 'hapi'

export default function (server: Hapi.Server, config) {

  server.route({
    method: 'GET',
    path: '/users',
    handler: (request, reply) => {
      return reply('hello world')
    }
  })

}