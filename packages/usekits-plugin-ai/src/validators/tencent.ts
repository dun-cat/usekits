import Joi from 'joi';

const accessKeyValidator = Joi.object({
  appId: Joi.required(),
  secretId: Joi.required(),
  secretKey: Joi.required()
});

export {
  accessKeyValidator
}