import * as Joi from 'joi'
import AuthRequest from './auth-request.validation'

const generateEmail = (context) => {
  try {
    return Joi.attempt(context.id, Joi.string().email())
  }
  catch (error) {/* fail silently */}
}
generateEmail['description'] = 'generated email'

const generateUsername = (context) => {
  try {
    return Joi.attempt(context.id, Joi.string().regex(/^@*/))
  }
  catch (error) {/* fail silently */}
}
generateUsername['description'] = 'generated username'

const LoginRequest = Joi.object({
  id: Joi.string().min(1).max(190).required(),
  auth: AuthRequest,
  email: Joi.string().default(generateEmail),
  username: Joi.string().default(generateUsername)
})

export default LoginRequest