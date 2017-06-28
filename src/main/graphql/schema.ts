import { bundle } from 'graphql-modules'
import { makeExecutableSchema } from 'graphql-tools'

import books from './books'
import authors from './authors'
import users from './users'

const modules = [books, authors, users]

export const schema = makeExecutableSchema(bundle(modules))
