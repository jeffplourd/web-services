import db from '../db/db'
import { BaseRow } from './base-row'
import { Role } from '../models/domain/user'

export interface UserRoleRow {
  userId: string
  role: Role
}

export class UserRoleRow extends BaseRow {

  constructor(
    public userId: string,
    public role: Role
  ) {
    super()
  }

}


export function insertUserRole(userRole: UserRoleRow) {
  return db.insert(userRole.toSql).into('classkick.user_role')
}
