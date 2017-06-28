import { UserRow } from '../../dao/user.dao'
import { UserRoleRow } from '../../dao/user-role.dao'
import { UserAuthRow } from '../../dao/user-auth.dao'

export enum Role {
  TEACHER,
  STUDENT,
  ADMIN
}

interface User {
  id: string
  email?: string
  username?: string
}

interface Roles {
  roles: Role[]
}

interface RoleUser extends User, Roles {}

export class UserRowData implements RoleUser {
  public id: string
  public email?: string
  public username?: string
  public roles: Role[]

  constructor(
    public userData: UserRow,
    public roleData: UserRoleRow[],
    public authData: UserAuthRow[]
  ) {
    this.id = userData.id
    this.roles = roleData.map(_ => _.role)
    this.email = userData.email || null
    this.username = userData.username || null
  }
}
