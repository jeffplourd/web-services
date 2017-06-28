import * as snakeCaseKeys from 'snakecase-keys'

export class BaseRow {

  constructor() {}

  get toSql() {
    return snakeCaseKeys(this)
  }

}