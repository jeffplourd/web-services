import db from '../db/db'
import { BaseRow } from './base-row'
import { Role } from '../models/domain/user'

export interface UserRoleRow {
  userId: string
  role: Role
}

export class UserRoleRow extends BaseRow {
  constructor(public userId: string, public role: Role) {
    super()
  }

  static apply(obj): UserRoleRow {
    return new UserRoleRow(obj.userId, obj.role)
  }
}

export function insertUserRole(userRole: UserRoleRow) {
  return db.insert(userRole.toSql).into('classkick.user_role')
}

export function getByUserId(id) {
  return db
    .select('*')
    .from('classkick.user_role')
    .where({ user_id: id })
    .then(result => {
      return result.map(roleRow =>
        UserRoleRow.apply(UserRoleRow.fromSql(roleRow))
      )
    })
}
