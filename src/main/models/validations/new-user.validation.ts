import * as Joi from 'joi'
import AuthRequest from './auth-request.validation'

const NewUser = Joi.object({
  email: Joi.string().min(5).max(190).email().required(),
  username: Joi.string().min(1).max(80),
  auth: AuthRequest,
  roles: Joi.array().items(Joi.string()),
  firstName: Joi.string().max(35),
  lastName: Joi.string().max(35),
  displayName: Joi.string().max(35)
})

export default NewUser
