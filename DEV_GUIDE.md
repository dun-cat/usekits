
# 开发手册

usekits 是使用 pnpm workspace 来管理的 monorepo 类型项目。packages 下的直接子级目录为独立的 npm 项目。

## usekits-cli

该子包为 usekits 的核心项目，其实现了一套插件机制、响应式隔离配置、CLI 入口相关功能。

## usekits-cache

该子包提供 usekits 缓存解决方案。

在插件研发时，由 usekits-cli 暴露的响应式配置实现，基于该包实现的。
