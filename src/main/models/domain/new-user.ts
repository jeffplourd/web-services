import { Role } from './user'

export interface NewUser {
  auth: AuthRequest
  username?: string
  email?: string
  roles?: Role[]
  firstName?: string
  lastName?: string
  displayName?: string
}