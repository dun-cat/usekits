import { log } from "@usekits/cli";
import path from 'path';

export type Text = {
  content: string;
}

export interface Provider {
  chat: (text: string) => Promise<Text>
}

export enum AIPlatorm {
  WIT_AI, OPEN_AI
}

const aiModule = new Map();
aiModule.set(AIPlatorm.WIT_AI, 'wit-ai')
aiModule.set(AIPlatorm.OPEN_AI, 'open-ai')


export function createAIProvider(aiPlatorm: AIPlatorm) {
  const modulePath = aiModule.get(aiPlatorm);
  if (!modulePath) {
    log.error('未找到 AI 模块')
    return null;
  }
  // 加载 AI 模块
  const AI = require(path.join(__dirname, modulePath));
  return new AI() as Provider;
}