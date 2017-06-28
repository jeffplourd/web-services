import books, { data as bookList } from './books'

export const data = [
  { id: 1, name: 'Douglas Crockford' },
  { id: 2, name: 'Walmyr Lima' }
]

const schema = `
   type Author {
     id: String
     name: String
     books: [Book]
   }
`

export const queries = `
   authors: [Author]
   author(id: Int): Author
`
const authors = () => data
const author = (root, args) => data.find(author => author.id === args.id)

const resolvers = {
  queries: {
    authors,
    author
  },
  Author: {
    books: author => bookList.filter(book => book.author === author.id)
  }
}

export default () => ({
  schema,
  queries,
  resolvers,
  modules: [books]
})
