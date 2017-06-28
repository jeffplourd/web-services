import * as uuid from 'uuid'
import * as moment from 'moment'
import * as bcrypt from 'bcrypt'
import * as authenticationService from './authentication.service'
import * as userDao from '../dao/user.dao'
import * as baseDao from '../dao/base.dao'
import * as userAuthDao from '../dao/user-auth.dao'
import * as userRoleDao from '../dao/user-role.dao'
import { UserRoleRow } from '../dao/user-role.dao'
import { UserAuthRow } from '../dao/user-auth.dao'
import { UserRow } from '../dao/user.dao'
import { NewUser } from '../models/domain/new-user'
import { UserRowData } from '../models/domain/user'
import * as Boom from 'boom'

export async function create(newUser: NewUser) {
  let userRowData = await newUserAccountRows(newUser)

  let token = authenticationService.createAccessToken(userRowData)

  await baseDao.createUser(userRowData)

  return token
}

export async function login(loginRequest) {

  let authRow

  if (loginRequest.email) {
    authRow = await userAuthDao.getByUserEmailAndType(loginRequest.email, loginRequest.auth.type)
  }
  else if (loginRequest.username) {
    authRow = loginRequest.username
  }

  let isValid = await validateAuthRow(authRow, loginRequest.auth)

  if (!isValid) {
    throw Boom.forbidden('Invalid credentials')
  }

  let userRow = await userDao.getById(authRow.userId)
  let userRoleRows = await userRoleDao.getByUserId(authRow.userId)
  let userRowData = new UserRowData(userRow, userRoleRows, [ authRow ])

  return authenticationService.createAccessToken(userRowData)
}

async function validateAuthRow(authRow: UserAuthRow, authRequest: AuthRequest): Promise<boolean> {
  if (authRequest.type === 'password') {
    return await authenticationService.checkPassword(authRequest.password, authRow.passwordHash)
  }
  return true
}

async function newUserAccountRows(newUser): Promise<UserRowData> {
  let userRow = newUserRow(newUser)
  let roleRows = newUser.roles
    ? newUser.roles.map(role => new UserRoleRow(userRow.id, role))
    : []
  let authRows = [(await newAuthRow(userRow, newUser.auth))]

  return new UserRowData(userRow, roleRows, authRows)
}

function newUserRow(newUser: NewUser): UserRow {
  let timestamp = sqlTimestamp()
  return new UserRow(
    uuid.v1(),
    newUser.username,
    newUser.email,
    newUser.firstName,
    newUser.lastName,
    newUser.displayName,
    timestamp,
    timestamp
  )
}

async function newAuthRow(
  user: UserRow,
  auth: AuthRequest
): Promise<UserAuthRow> {
  let salt = await bcrypt.genSalt(10)
  let hash = await bcrypt.hash(auth.password, salt)
  let timestamp = sqlTimestamp()

  return new UserAuthRow(
    user.id,
    auth.type,
    timestamp,
    salt,
    '',
    timestamp,
    '',
    null,
    hash
  )
}

function sqlTimestamp() {
  return moment().format('YYYY-MM-DD HH:mm:ss')
}
