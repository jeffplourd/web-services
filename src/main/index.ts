import * as Server from './server'
import * as config from 'config'

console.log(`Running environment ${process.env.NODE_ENV || 'dev'}`)

// Catch unhandled unexpected exceptions
process.on('uncaughtException', (error: Error) => {
  console.error(`uncaughtException ${error.message}`)
})

// Catch unhandled rejected promises
process.on('unhandledRejection', (reason: any) => {
  console.error(`unhandledRejection ${reason}`)
})

Server.init(config).then(server => {
  server.start(() => {
    console.log('Server running at: ', server.info.uri)
  })
})
