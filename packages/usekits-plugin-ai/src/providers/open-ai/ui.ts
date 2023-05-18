import { QuestionCollection } from "inquirer";
import config from "@src/config";
import Joi from 'joi';

const accessKey: QuestionCollection = [{
  type: 'input',
  message: '请输入 openAI API Key:',
  name: 'apiKey',
  default: () => config.openAI.apiKey,
  validate(input) {
    const result = Joi.required().validate(input);
    if (result.error) {
      return false
    }
    return true
  }
}]

const proxy: QuestionCollection = [{
  type: 'input',
  message: '请输入 Socks 代理地址:',
  name: 'socksProxy',
  default: () => config.openAI.socksProxy,
  validate(input) {
    const result = Joi.required().validate(input);
    if (result.error) {
      return false
    }
    return true
  }
}]


export default { accessKey, proxy }