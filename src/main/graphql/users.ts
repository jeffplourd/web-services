import * as userDao from '../dao/user.dao'

const schema = `
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
  user(email: String): User
`

export const mutations = `
  updateUser(id: Int, name: String): User
`
// query resolvers
const users = () => {
  return userDao.getAll()
}

const user = (_, args) => {
  return userDao.getByEmail(args.email)
}

// mutation resolvers
// const updateBook = (root, args) => data.find(book => book.id === args.id)
const updateUser = (root, args) => {
  console.log('updateUser', root, args)
  return {
    id: 'test',
    email: 'test@email.com'
  }
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
