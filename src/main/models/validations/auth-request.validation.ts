import * as Joi from 'joi'
import { Schema } from 'joi'

const authRequest: Joi.ObjectSchema = Joi.object({
  type: Joi.string().required(),
  password: Joi.string().required(),
})

export default authRequest
