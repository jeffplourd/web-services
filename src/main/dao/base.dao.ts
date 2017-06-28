import db from '../db/db'
import * as userDao from '../dao/user.dao'
import * as userAuthDao from './user-auth.dao'
import * as userRoleDao from './user-role.dao'
import { UserRowData } from '../models/domain/user'

export function createUser(user: UserRowData) {
  // refactor to actually use transaction
  return db.transaction(transaction => {
    return Promise.all([
      userDao.insertUser(user.userData),
      Promise.all(
        user.roleData.map(roleRow => userRoleDao.insertUserRole(roleRow))
      ),
      Promise.all(
        user.authData.map(authRow => userAuthDao.insertUserAuth(authRow))
      )
    ])
  })
}
