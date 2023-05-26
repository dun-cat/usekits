# usekits

适合个人开发者的命令行工具，提供插件机制来定制属于个人 CLI 命令

## 安装

``` shell
npm install @usekits/cli
```

## 使用

``` shell
use [command]
```

## 插件

usekits 提供了`插件机制`，你可以实现自己的命令和命令行 UI。usekits 的插件是一个函数，并提供了`commander`实例作为入参。

下面是一个简单的插件 TypeScript 实现：

``` ts
import { Command } from 'commander';
import { UseKitsCLI } from "@usekits/cli";
const gitPlugin: UseKitsCLI.Plugin = (program: Command) => {
  program
    .command('commit [message]')
    .description('Git 提交代码')
    .alias('c')
    .option('--disable-push', '提交代码后，是否推送到仓库，默认给予推送提示弹框。')
    .action(function() {
      console.log(this.args,this.opts())
    });
}
```

通过的`this.args`和`this.opts()`可以获取命令行内的`arguments`和`options`。

### 响应式持久化配置

usekits 为插件提供了一种`响应式持久化配置`方式，能让插件实现`隔离的`持久化配置，非常便利。

下面是一个配置类的实现，usekits 提供 `@PluginConfig` 装饰器来实现配置类。

```ts
import { PluginConfig } from "@usekits/cli";

@PluginConfig()
class Config {
  tencent = {
    accessKey: {
      appId: "",
      secretId: "",
      secretKey: "",
    }
  }
  openAI = {
    apiKey: "",
    socksProxy: "",
  }
}

const config = new Config();
export default config;
```

通过响应式编程元素的应用，我们可以直接赋值来修改配置：

``` ts
config.tencent.accessKey.secretId = '7a8b2e13-1c45-4d6f-89ab-3f5d9c8e2a56'
```

当然，你也可以赋值一个对象：

``` ts
config.tencent = {
  secretId: '7a8b2e13-1c45-4d6f-89ab-3f5d9c8e2a56',
  appId: '10111',
  secretKey: '2@R9q8$K5#yT3@!v'
}
```

`usekits`为配置提供了隔离，每一个插件都有唯一一个对应的配置，当删除插件时也会提示你是否删除本地的配置。在第一次进行赋值时，会在用户目录生成配置文件。

以官方插件`@usekits/plugin-ai`为例，在用户目录生成的路径如下：

``` shell
/Users/lumin/.usekits/data/@usekits/plugin-ai/confg/default.json
```

## 内置插件

usekits 内置了一些插件：

* `config`：该插件用于直接修改插件的持久化配置；
* `git-commit`：该插件用于规范 commit 提交消息；
* `plugin`：该插件用于管理插件（添加、删除、展示、禁用）等。

`plugin`和`config`插件用于对插件管理和插件配置的管理，而`git-commit`是作为工作空间必备功能添加的。

内置插件跟随`@usekits/cli`一起安装，无需额外手动安装。

## 官方插件

* `@usekits/plugin-ai`：一个命令行聊天 AI，接入 OpenAI 的 SDK；

## help

插件一般以子命令的方式使用。当直接使用`use --help`时，可以看到已启用的插件的子命令：

``` shell
Usage: command [options] [command]

Options:
  -v, --version                       当前版本号
  -d, --debug                         输出额外的调试信息
  -y, --yes                           无弹框提示，所有操作默认通过，适合自动化环境
  -h, --help                          使用帮助

Commands:
  config|conf <plugin> <key> <value>  插件配置管理
  commit|c [options] [message]        Git 提交代码
  plugin|p                            插件管理
  ai                                  AI 机器人
  help [command]                      display help for command
```

而每个子命令，有自己的单独 help，例如我们执行`use config --help`：

``` shell
Usage: command config|conf [options] [command] <plugin> <key> <value>

插件配置管理

Arguments:
  plugin                      插件包名
  key                         配置项 Key
  value                       配置项 Value

Options:
  -h, --help                  display help for command

Commands:
  list|ls <plugin>            列出插件所有配置项
  set <plugin> <key> <value>  设置配置项
  get <plugin> <key>          获取指定 key 的配置项
  help [command]              display help for command
```
