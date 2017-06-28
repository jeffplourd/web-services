import * as jwt from 'jsonwebtoken'
import * as config from 'config'
import * as bcrypt from 'bcrypt'
import { UserRowData } from '../models/domain/user'

export function createAccessToken(user: UserRowData) {
  return jwt.sign(
    {
      sub: user.id,
      authType: user.authData[0].type,
      email: user.email || null,
      roles: user.roles
    },
    config.server.secret,
    {
      algorithm: 'HS256',
      expiresIn: '24h'
    }
  )
}

export function checkPassword(password: string, hash) {
  return bcrypt.compare(password, hash)
}
