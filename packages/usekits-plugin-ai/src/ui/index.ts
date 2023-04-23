import inquirer, { Answers, Question, QuestionCollection } from 'inquirer';
const inputType: QuestionCollection<{
  inputType: 'keyboard' | 'audio'
}> = [{
  type: 'list',
  name: 'inputType',
  message: '请选择输入方式',
  choices: [{
    name: '键盘输入',
    value: 'keyboard'
  },
  {
    name: '音频输入',
    value: 'audio'
  },
  ]
}]


export default {
  inputType
}