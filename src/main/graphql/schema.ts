import { bundle } from 'graphql-modules'
import { makeExecutableSchema } from 'graphql-tools'

import books from './books'
import authors from './authors';

const modules = [books, authors]

export const schema = makeExecutableSchema(bundle(modules))