import authors, { data as authorList } from './authors'
import * as fs from 'fs'

export const data = [
  { id: 1, title: 'JavaScript: The Good Parts', author: 1 },
  { id: 2, title: 'End to end testing with Protractor', author: 2 }
]

const schema = `
  type Book {
    id: String
    title: String
    author: Author
  }
`

export const queries = `
  books: [Book]
  book(id: Int): Book
`

export const mutations = `
  updateBook(id: Int, name: String): Book
`
// query resolvers
const books = () => data
const book = (root, args, context) => {
  console.log('root', root, 'args', args, 'context', context);
  return data.find(book => book.id === args.id)
}

// mutation resolvers
const updateBook = (root, args) => data.find(book => book.id === args.id)

const resolvers = {
  queries: {
    books,
    book
  },
  mutations: {
    updateBook
  },
  Book: {
    author: book => authorList.find(author => author.id === book.author)
  }
}

export default () => ({
  schema,
  queries,
  mutations,
  resolvers,
  modules: [authors]
})