import * as userDao from '../dao/user.dao'
import * as userService from '../services/user.service'

const schema = `
  input UserUpdate {
    username: String
    email: String
    firstName: String
    lastName: String
    displayName: String
  }
  
  type User {
    id: String
    email: String
    username: String
    firstName: String
    lastName: String
    displayName: String
    created: String
  }
`

export const queries = `
  users: [User]
  user(email: String): Boolean
`

export const mutations = `
  updateUser(id: String, update: UserUpdate): Boolean
`
// query resolvers
const users = () => {
  return userDao.getAll()
}

const user = (_, args) => {
  return userDao.getByEmail(args.email)
}

// mutation resolvers
const updateUser = (_, args) => {
  return userService.update(args.id, args.update)
}

const resolvers = {
  queries: {
    users,
    user
  },
  mutations: {
    updateUser
  }
}

export default () => ({
  schema,
  queries,
  mutations,
  resolvers
})
