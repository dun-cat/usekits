import config from "@src/config";
import { QuestionCollection } from "inquirer";
import Joi from 'joi';

const accessKey: QuestionCollection = [{
  type: 'input',
  message: '请输入腾讯云 AppId:',
  name: 'appId',
  default: () => config.tencent.accessKey.appId,
  validate(input, answers) {
    const result = Joi.required().validate(input);
    if (result.error) {
      return false
    }
    return true
  },
}, {
  type: 'input',
  message: '请输入腾讯云 SecretId:',
  name: 'secretId',
  default: () => config.tencent.accessKey.secretId,
  validate(input, answers) {
    const result = Joi.required().validate(input);
    if (result.error) {
      return false
    }
    return true
  }
}, {
  type: 'input',
  message: '请输入腾讯云 SecretKey:',
  name: 'secretKey',
  default: () => config.tencent.accessKey.secretKey,
  validate(input, answers) {
    const result = Joi.required().validate(input);
    if (result.error) {
      return false
    }
    return true
  }
}
]
export default {
  accessKey
}