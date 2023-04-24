import Joi from 'joi';

const authValidator = Joi.object({
  appId: Joi.required(),
  secretId: Joi.required(),
  secretKey: Joi.required()
}).options({ allowUnknown: true });;

export {
  authValidator
}