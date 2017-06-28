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

}

export function insertUserAuth(auth: UserAuthRow) {
  return db.insert(auth.toSql).into('classkick.user_auth')
}
