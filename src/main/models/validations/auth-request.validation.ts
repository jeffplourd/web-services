import * as Joi from 'joi'

const AuthRequest: Joi.ObjectSchema = Joi.object({
  type: Joi.string().required(),
  password: Joi.string()
})

export default AuthRequest
