import db from '../db/db'
import * as userDao from '../dao/user.dao'
import * as userAuthDao from './user-auth.dao'
import * as userRoleDao from './user-role.dao'
import { UserAuthRow } from './user-auth.dao'
import { UserRoleRow } from './user-role.dao'
import { BaseRow } from './base-row'
import { UserRowData } from '../models/domain/user'


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

export function createUser(user: UserRowData) {
  // refactor to actually use transaction
  return db.transaction((transaction) => {
    return Promise.all([
      userDao.insertUser(user.userData),
      Promise.all(user.roleData.map((roleRow) => userRoleDao.insertUserRole(roleRow))),
      Promise.all(user.authData.map((authRow) => userAuthDao.insertUserAuth(authRow)))
    ])
  })
}