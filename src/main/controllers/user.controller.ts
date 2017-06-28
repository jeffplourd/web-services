import * as Hapi from 'hapi'
import * as userService from '../services/user.service'
import newUser from '../models/validations/new-user.validation'

export default function (server: Hapi.Server, config) {

  server.route({
    method: 'GET',
    path: '/users',
    handler: (request, reply) => {
      console.log('request', request.auth.credentials)
      return reply('hello world')
    },
    config: {
      auth:  'jwt'
    }
  })

  server.route({
    method: 'POST',
    path: '/users',
    handler: (request, reply) => {
      userService.create(request.payload).then((token) => {
        reply(token)
      })
    },
    config: {
      validate: {
        payload: newUser
      },
      auth: false
    }
  })

  server.route({
    method: 'POST',
    path: '/users/login',
    handler: (request, reply) => {

    },
    config: {
      auth: false
    }
  })

}