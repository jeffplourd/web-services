const Lab = require('lab')
const lab = (exports.lab = Lab.script())
import * as userDao from '../main/dao/user.dao'

lab.experiment('math', () => {
  lab.test('returns true when 1 + 1 equals 2', done => {
    Lab.expect(1 + 1).to.equal(2)
    done()
  })
})
