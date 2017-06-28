import * as snakecaseKeys from 'snakecase-keys'
import * as camelcaseKeys from 'camelcase-keys'

export class BaseRow {
  constructor() {}

  get toSql() {
    return BaseRow.toSql(this)
  }

  static toSql(value) {
    return snakecaseKeys(value)
  }

  static fromSql(value) {
    return camelcaseKeys(value)
  }
}
