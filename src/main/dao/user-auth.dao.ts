import db from '../db/db'
import { BaseRow } from './base-row'

export interface UserAuthRow {
  userId: string
  type: string
  created: string
  salt: string
  accessTokenHash: string
  accessTokenCreated: string
  resetTokenHash: string
  resetTokenCreated: string
  passwordHash: string
}

export class UserAuthRow extends BaseRow {
  constructor(
    public userId: string,
    public type: string,
    public created: string,
    public salt: string,
    public accessTokenHash: string,
    public accessTokenCreated: string,
    public resetTokenHash: string,
    public resetTokenCreated: string,
    public passwordHash: string
  ) {
    super()
  }

  static apply(obj): UserAuthRow {
    return new UserAuthRow(
      obj.userId,
      obj.type,
      obj.created,
      obj.salt,
      obj.accessTokenHash,
      obj.accessTokenCreated,
      obj.resetTokenHash,
      obj.resetTokenCreated,
      obj.passwordHash
    )
  }
}

export function insertUserAuth(auth: UserAuthRow) {
  return db.insert(auth.toSql).into('classkick.user_auth')
}

export function getByUserEmailAndType(userEmail: string, authType: string) {
  return db
    .raw(
      `SELECT a.* FROM classkick.user_auth a JOIN classkick.user u ON a.user_id = u.id WHERE u.email = '${userEmail}' AND a.type = '${authType}'`
    )
    .then((result) => getHead(result))
}

export function getByUsernameAndType(username: string, authType: string) {
  return db
    .raw(
      `SELECT a.* FROM classkick.user_auth a JOIN classkick.user u ON a.user_id = u.id WHERE u.username = ${username} AND a.type = ${authType}`
    )
    .then((result) => getHead(result))
}


function getHead(result): UserAuthRow|undefined {
  let head = result.rows && result.rows[0]
  return head ? UserAuthRow.apply(UserAuthRow.fromSql(head)) : undefined
}