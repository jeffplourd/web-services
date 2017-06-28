import * as snakecaseKeys from 'snakecase-keys'
import * as camelcaseKeys from 'camelcase-keys'

export class BaseRow {
  constructor() {}

  get toSql() {
    return snakecaseKeys(this)
  }

  static fromSql(value) {
    return camelcaseKeys(value)
  }
}