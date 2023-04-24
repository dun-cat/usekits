import config from "@src/config";
import { authValidator } from "@src/validators/tencent"
import { QuestionCollection } from "inquirer";


const accessKey: QuestionCollection = [{
  type: 'input',
  message: '请输入 AppId:',
  name: 'appId',
  default: () => config.tencent.accessKey.appId,
  validate(input, answers) {
    const result = authValidator.validate(answers);
    console.log('result', result)
  },
  when(answers) {
    const result = authValidator.validate(answers);
  }
}, {
  type: 'input',
  message: '请输入 SecretId:',
  name: 'secretId',
  default: () => config.tencent.accessKey.secretId,
  when(answers) {
    const result = authValidator.validate(answers);
  }
}, {
  type: 'input',
  message: '请输入 SecretKey:',
  name: 'secretKey',
  default: () => config.tencent.accessKey.secretKey,
  when(answers) {
    const result = authValidator.validate(answers);
    console.log(result)
  }
}
]
export default {
  accessKey
}