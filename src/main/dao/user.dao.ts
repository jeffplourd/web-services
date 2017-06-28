import db from '../db/db'
import { BaseRow } from './base-row'

export interface UserRow {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  displayName: string
  created: string
  lastLogin: string
}

export class UserRow extends BaseRow {
  constructor(
    public id: string,
    public username: string,
    public email: string = null,
    public firstName: string = null,
    public lastName: string = null,
    public displayName: string = null,
    public created: string,
    public lastLogin: string
  ) {
    super()
  }
}

export function insertUser(user: UserRow) {
  return db.insert(user.toSql).into('classkick.user')
}

export function getById(id: string) {
  return db.select('*').from('classkick.user').where({ id }).then(result => {
    let head = result[0]
    return UserRow.fromSql(head)
  })
}

export function getByEmail(email: string) {
  return db.select('*').from('classkick.user').where({ email }).then(result => {
    let head = result[0]
    return UserRow.fromSql(head)
  })
}

export function getAll() {
  return db.select('*').from('classkick.user').then(result => {
    return result.map(userRow => UserRow.fromSql(userRow))
  })
}
