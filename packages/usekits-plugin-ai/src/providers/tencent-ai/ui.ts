import config from "@src/config";
import { accessKeyValidator } from "@src/validators/tencent"

export default {
  accessKey: [{
    type: 'input',
    message: '请输入 AppId:',
    name: 'appId',
    default: () => config.tencent.accessKey.appId,
    when(answers) {
      const result = accessKeyValidator.validate(answers);
      console.log(result)
      return false;
    }
  }]
}