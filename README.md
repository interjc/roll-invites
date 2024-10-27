# Nuxt 抽奖项目

本项目是一个基于 Nuxt 3 的简单抽奖应用。

## 环境配置

在运行项目之前，请确保正确配置 `.env` 文件。您可以参考 `.env.example` 文件来创建自己的 `.env` 文件。

需要配置的参数包括：

- `SECRET_CODE`: 中奖后显示的激活码
- `SECRET_INFO`: 关于激活码的附加信息

## 本地开发

执行以下命令即可启动本地开发环境：

```bash
./dev.sh
```

直接在浏览器中访问 `http://localhost:3000` 即可看到抽奖页面。

## 部署

直接按 Nuxt 官方文档的说明操作即可。可选的部署方式包括：

- 使用 Vercel
- 使用 Cloudflare Pages
- 使用 Docker
