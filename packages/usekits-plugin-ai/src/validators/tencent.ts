import Joi from 'joi';

const authValidator = Joi.object({
  appId: Joi.string().empty('').required(),
  secretId: Joi.string().empty('').required(),
  secretKey: Joi.string().empty('').required()
});

export {
  authValidator
}