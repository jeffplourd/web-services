import * as Hapi from 'hapi'
import * as userService from '../services/user.service'
import NewUser from '../models/validations/new-user.validation'
import LoginRequest from '../models/validations/login-request.validation'

export default function(server: Hapi.Server, config) {
  server.route({
    method: 'GET',
    path: '/users',
    handler: (request, reply) => {
      console.log('request', request.auth.credentials)
      return reply('hello world')
    },
    config: {
      auth: 'jwt'
    }
  })

  server.route({
    method: 'POST',
    path: '/users',
    handler: (request, reply) => {
      userService.create(request.payload).then(token => {
        reply({ token })
      })
    },
    config: {
      validate: {
        payload: NewUser
      },
      auth: false
    }
  })

  server.route({
    method: 'POST',
    path: '/users/login',
    handler: (request, reply) => {
      userService.login(request.payload)
        .then(token => {
          reply({ token })
        })
        .catch(error => {
          reply(error)
        })
    },
    config: {
      validate: {
        payload: LoginRequest
      },
      auth: false
    }
  })
}
